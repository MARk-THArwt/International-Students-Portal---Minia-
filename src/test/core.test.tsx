// @vitest-environment jsdom
/**
 * core.test.tsx
 *
 * 3 Unit Tests  — pure logic, no DOM needed for 1 & 2
 * 2 Integration Tests — component + Redux store + Router wired together
 *
 * Stack: Vitest · React Testing Library · userEvent
 */

import React from "react";
import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// ── Application imports ────────────────────────────────────────────────────────
import authReducer, {
  clearError,
  login,
} from "../store/slices/authSlice";
import servicesReducer from "../store/slices/servicesslice";
import requestsReducer from "../store/slices/requestsSlice";
import eventsReducer from "../store/slices/eventsSlice";
import reportsReducer from "../store/slices/reportsSlice";
import messagesReducer from "../store/slices/messagesSlice";
import notificationsReducer from "../store/slices/notificationsSlice";
import { extractErrorMessage } from "../api/api";
import { Login } from "../pages/login/login";
import { ProtectedAdminRoute } from "../pages/Dashbord/ProtectedAdminRoute";

// ─── i18n stub — prevents missing provider errors in component renders ─────────
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key.split(".").at(-1) ?? key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

// ─── MSW server — only for the integration tests that hit the network ──────────
const server = setupServer(
  http.post(`*/api/auth/login`, () =>
    HttpResponse.json({
      status: "success",
      user: {
        _id: "u1",
        name: "Ahmed",
        email: "ahmed@test.com",
        role: "student",
        avatar: null,
        gender: "male",
      },
    })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  cleanup();
});
afterAll(() => server.close());

// ─── Shared store factory ──────────────────────────────────────────────────────
function makeStore(preloadedState?: object) {
  return configureStore({
    reducer: {
      auth: authReducer,
      services: servicesReducer,
      requests: requestsReducer,
      events: eventsReducer,
      reports: reportsReducer,
      messages: messagesReducer,
      notifications: notificationsReducer,
    },
    preloadedState,
  });
}

// Helper to render with Provider + MemoryRouter
function renderWithProviders(
  ui: React.ReactElement,
  { store = makeStore(), route = "/" }: { store?: ReturnType<typeof makeStore>; route?: string } = {}
) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TEST 1
// Validates: authSlice synchronous reducer — clearError sets error to null
// Why: clearError is called on modal close / form reset throughout the app.
//      A broken reducer would leave stale error messages visible to users.
// ══════════════════════════════════════════════════════════════════════════════
describe("Unit 1 — authSlice: clearError reducer", () => {
  it("sets error to null when clearError is dispatched", () => {
    const store = makeStore({
      auth: {
        user: null,
        loading: false,
        error: "Previous login error",
        users: [],
        usersPagination: { page: 1, limit: 10, total: 0 },
        usersLoading: false,
        usersError: null,
      },
    });

    // Action before — error should be set
    expect(store.getState().auth.error).toBe("Previous login error");

    store.dispatch(clearError());

    // Action after — error must be null
    expect(store.getState().auth.error).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TEST 2
// Validates: authSlice async thunk — login.rejected sets error & loading:false
// Why: If the error field isn't set on rejection, users never see the reason
//      their login failed (silent failure).
// ══════════════════════════════════════════════════════════════════════════════
describe("Unit 2 — authSlice: login.rejected state transition", () => {
  it("sets error message and loading:false when login API returns 401", async () => {
    // Override MSW to return a 401 for this test only
    server.use(
      http.post(`*/api/auth/login`, () =>
        HttpResponse.json({ message: "Invalid credentials" }, { status: 401 })
      )
    );

    const store = makeStore();

    await store.dispatch(login({ email: "bad@test.com", password: "wrong", role: "student" }));

    const { loading, error, user } = store.getState().auth;

    // After rejection: loading stops, error is populated, user stays null
    expect(loading).toBe(false);
    expect(error).toBe("Invalid credentials");
    expect(user).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TEST 3
// Validates: extractErrorMessage() utility — Axios error → response.data.message
// Why: Every single async thunk in the app calls this utility. A bug here
//      breaks error display across ALL features simultaneously.
// ══════════════════════════════════════════════════════════════════════════════
describe("Unit 3 — extractErrorMessage utility", () => {
  it("returns response.data.message from an AxiosError", () => {
    const axiosError = new AxiosError("Request failed");
    axiosError.response = {
      data: { message: "Email already exists" },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {} as any,
    } as any;

    expect(extractErrorMessage(axiosError)).toBe("Email already exists");
  });

  it("falls back to generic message for non-Error values", () => {
    // Thrown strings, numbers, or plain objects should not crash the utility
    expect(extractErrorMessage("something broke")).toBe("An unexpected error occurred.");
    expect(extractErrorMessage(null)).toBe("An unexpected error occurred.");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TEST 1
// Validates: Login component renders correctly AND dispatches login thunk
//            with the email/password/role the user typed
// Why: The component glues the form → Redux dispatch → API call.
//      We verify the full chain: user types → correct payload reaches the API.
// ══════════════════════════════════════════════════════════════════════════════
describe("Integration 1 — Login component: render + form submission", () => {
  it("renders form fields and submits credentials to the login API", async () => {
    const user = userEvent.setup();
    let capturedBody: Record<string, string> | null = null;

    // Intercept the network request to capture what was actually sent
    server.use(
      http.post(`*/api/auth/login`, async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, string>;
        return HttpResponse.json({
          status: "success",
          user: { _id: "u1", name: "Ahmed", email: "ahmed@test.com", role: "student", avatar: null, gender: "male" },
        });
      })
    );

    renderWithProviders(<Login />);

    // — Rendering check —
    // email input must be present (accessible via input name)
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const roleSelect = document.querySelector('select[name="role"]') as HTMLSelectElement;

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();

    // — Interaction check —
    await user.type(emailInput, "ahmed@test.com");
    await user.type(passwordInput, "secret123");
    await user.selectOptions(roleSelect, "staff");
    await user.click(screen.getByRole("button", { name: /sign.*in|signIn/i }));

    // — Payload check — the API should receive exactly what the user typed
    await waitFor(() => {
      expect(capturedBody).toMatchObject({
        email: "ahmed@test.com",
        password: "secret123",
        role: "staff",
      });
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TEST 2
// Validates: ProtectedAdminRoute — renders children for admin, redirects
//            non-admin users to /dashboard
// Why: This is a security gate. A broken guard silently exposes admin pages
//      to students or staff. Unit-testing the route in isolation, wired to
//      the real Redux store, is the most reliable way to catch regressions.
// ══════════════════════════════════════════════════════════════════════════════
describe("Integration 2 — ProtectedAdminRoute: role-based access control", () => {
  const AdminPage = () => <div>Admin Page Content</div>;

  function renderRoute(userState: object | null) {
    const store = makeStore({
      auth: {
        user: userState,
        loading: false,
        error: null,
        users: [],
        usersPagination: { page: 1, limit: 10, total: 0 },
        usersLoading: false,
        usersError: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard/admin"]}>
          <Routes>
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              }
            />
            {/* Redirect targets — needed so Navigate has somewhere to go */}
            <Route path="/Login" element={<div>Login Page</div>} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  }

  it("renders children when the logged-in user has role=admin", () => {
    renderRoute({ _id: "admin-1", name: "Admin", email: "a@a.com", role: "admin", avatar: null, gender: "male" });
    expect(screen.getByText("Admin Page Content")).toBeInTheDocument();
  });

  it("redirects a student user to /dashboard (not admin)", async () => {
    renderRoute({ _id: "stu-1", name: "Student", email: "s@s.com", role: "student", avatar: null, gender: "male" });
    // Admin content must NOT be visible; the user lands on /dashboard instead
    await waitFor(() => {
      expect(screen.queryByText("Admin Page Content")).not.toBeInTheDocument();
      expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });
  });

  it("redirects an unauthenticated visitor to /Login", async () => {
    renderRoute(null); // no user in store
    await waitFor(() => {
      expect(screen.queryByText("Admin Page Content")).not.toBeInTheDocument();
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });
});
