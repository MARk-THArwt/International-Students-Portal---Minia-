import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import {
  getMyMessages,
  getAllMessages,
  sendMessage,
  replyMessage,
  setSelectedConversation,
} from "../../store/slices/messagesSlice";
import type { Message, Conversation } from "../../store/slices/messagesSlice";
import { ConversationsList } from "./components/ConversationsList";
import { ChatWindow } from "./components/ChatWindow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Find the latest unread reply from a staff/admin member across all conversations */
function findLatestUnreadStaffReply(conversations: Conversation[]): Message | null {
  let latest: Message | null = null;

  for (const conv of conversations) {
    for (const msg of conv.messages) {
      const isStaffMsg = msg.sender.role !== "student";
      if (isStaffMsg && !msg.isRead) {
        if (!latest || new Date(msg.createdAt) > new Date(latest.createdAt)) {
          latest = msg;
        }
      }
    }
  }
  return latest;
}

function formatTime(iso: string, t: any): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return t("contactPage.time.justNow");
  if (diffMin < 60) return t("contactPage.time.minAgo", { count: diffMin });
  if (diffHr < 24) return t(diffHr > 1 ? "contactPage.time.hoursAgo" : "contactPage.time.hourAgo", { count: diffHr });
  if (diffDay < 7) return t(diffDay > 1 ? "contactPage.time.daysAgo" : "contactPage.time.dayAgo", { count: diffDay });
  return new Intl.DateTimeFormat(document.documentElement.lang === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" }).format(d);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Shown when there is at least one unread staff reply */
const LatestReplyCard = ({ message }: { message: Message }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-original-card border border-original-border-light rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MarkEmailUnreadIcon className="text-original-primary" sx={{ fontSize: 22 }} />
          <span className="text-sm font-bold text-original-primary">{t("contactPage.newReplyFromSupport")}</span>
        </div>
        <span className="text-[11px] font-bold text-white bg-original-primary px-2.5 py-0.5 rounded-full">
          {t("contactPage.newReply")}
        </span>
      </div>

    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-original-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
        {message.sender.avatar ? (
          <img src={message.sender.avatar} alt={message.sender.name} className="w-full h-full object-cover rounded-full" />
        ) : (
          message.sender.name.charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-original-text">{message.sender.name}</span>
          <span className="text-xs text-original-text-muted/70 capitalize">· {message.sender.role}</span>
        </div>
        <p className="text-sm text-original-text leading-relaxed m-0 bg-original-background-alt text-original-primary border border-original-border-light rounded-xl px-4 py-3">
          "{message.message}"
        </p>
        <div className="flex items-center gap-1 mt-2">
          <AccessTimeIcon sx={{ fontSize: 13 }} className="text-original-text-muted/70" />
          <span className="text-[11px] text-original-text-muted/70">{formatTime(message.createdAt, t)}</span>
        </div>
      </div>
    </div>
  </div>
);
};

/** Inquiry form — shown when there are no unread staff replies */
const InquiryForm = ({
  onSend,
  sendLoading,
  lastSentTime,
}: {
  onSend: (text: string) => void;
  sendLoading: boolean;
  lastSentTime?: string | null;
}) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!text.trim() || sendLoading) return;
    onSend(text.trim());
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="bg-original-card border border-original-border rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SupportAgentIcon className="text-original-accent" sx={{ fontSize: 22 }} />
        <span className="text-sm font-bold text-original-text">{t("contactPage.sendInquiry")}</span>
      </div>

      {sent ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircleOutlineIcon className="text-original-success mb-2" sx={{ fontSize: 40 }} />
          <p className="font-semibold text-original-success text-sm m-0">{t("contactPage.messageSentSuccess")}</p>
          <p className="text-xs text-original-text-muted mt-1">
            {t("contactPage.supportReviewNote")}
          </p>
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("contactPage.describeIssuePlaceholder")}
            rows={5}
            className="w-full resize-none border border-original-border rounded-xl px-4 py-3 text-sm text-original-text focus:outline-none focus:ring-2 focus:ring-original-primary/30 focus:border-original-primary placeholder-original-text-muted/50 transition-all"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-original-text-muted/70">{text.length} / 1000 {t("contactPage.characters")}</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || sendLoading}
              className="flex items-center gap-2 bg-original-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-original-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendIcon sx={{ fontSize: 16 }} />
              )}
              {sendLoading ? t("contactPage.sending") : t("contactPage.sendInquiryBtn")}
            </button>
          </div>
        </>
      )}

      {lastSentTime && !sent && (
        <p className="text-xs text-original-text-muted/70 mt-3 flex items-center gap-1">
          <AccessTimeIcon sx={{ fontSize: 12 }} />
          {t("contactPage.lastInquirySent")} {formatTime(lastSentTime, t)}
        </p>
      )}
    </div>
  );
};

/** Waiting state card */
const WaitingCard = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-original-warning-light border border-original-warning-light rounded-2xl p-5 flex items-start gap-3">
      <AccessTimeIcon className="text-original-warning shrink-0 mt-0.5" sx={{ fontSize: 22 }} />
      <div>
        <p className="font-semibold text-original-warning text-sm m-0 mb-1">{t("contactPage.awaitingStaffResponse")}</p>
        <p className="text-xs text-original-warning m-0 leading-relaxed">
          {t("contactPage.awaitingResponseDesc")}
        </p>
      </div>
    </div>
  );
};

// ─── Main Contact Page ────────────────────────────────────────────────────────

const Contact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((s) => s.auth.user);
  const isStudent = authUser?.role === "student";

  const { conversations, selectedConversation, loading, sendLoading } = useAppSelector(
    (s) => s.messages
  );

  // ── Auth Guard ──
  useEffect(() => {
    if (!authUser) {
      navigate("/login", { replace: true });
    }
  }, [authUser, navigate]);

  // ── Fetch ──
  useEffect(() => {
    if (!authUser) return;
    if (isStudent) {
      dispatch(getMyMessages());
    } else {
      dispatch(getAllMessages());
    }
  }, [dispatch, isStudent, authUser]);

  // ── Student: detect unread staff reply and last sent message time ──
  const latestUnreadReply = useMemo(() => {
    if (!isStudent) return null;
    return findLatestUnreadStaffReply(conversations);
  }, [conversations, isStudent]);

  const lastStudentMessageTime = useMemo(() => {
    if (!isStudent) return null;
    let latest: string | null = null;
    for (const conv of conversations) {
      for (const msg of conv.messages) {
        if (msg.sender.role === "student") {
          if (!latest || new Date(msg.createdAt) > new Date(latest)) {
            latest = msg.createdAt;
          }
        }
      }
    }
    return latest;
  }, [conversations, isStudent]);

  // ── Handlers ──
  const handleStudentSend = (text: string) => {
    dispatch(sendMessage({ message: text })).then(() => dispatch(getMyMessages()));
  };

  const handleStaffSend = (text: string) => {
    if (!selectedConversation) return;
    dispatch(replyMessage({ message: text, studentId: selectedConversation.with._id })).then(() =>
      dispatch(getAllMessages())
    );
  };

  // ── Staff/Admin Mobile Back ──
  const hasActiveChat = !isStudent && !!selectedConversation;
  const handleBack = () => dispatch(setSelectedConversation(null));

  if (!authUser) return null; // being redirected

  // ══════════════════════════════════════════════════════════════════
  // STUDENT VIEW — Support Center UI
  // ══════════════════════════════════════════════════════════════════
  if (isStudent) {
    return (
      <div className="min-h-screen bg-original-background font-['Public_Sans']">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">

          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-original-secondary rounded-2xl mb-4">
              <SupportAgentIcon className="text-original-accent" sx={{ fontSize: 32 }} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-original-secondary m-0">{t("contactPage.supportCenter")}</h1>
            <p className="text-original-text-muted text-sm mt-2 mb-0">
              {t("contactPage.supportCenterDesc")}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-original-primary/20 border-t-original-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-original-text-muted">{t("contactPage.loadingInquiries")}</p>
            </div>
          ) : (
            <>
              {/* CASE 1: Show latest unread reply from staff */}
              {latestUnreadReply && <LatestReplyCard message={latestUnreadReply} />}

              {/* Inquiry Form */}
              <InquiryForm
                onSend={handleStudentSend}
                sendLoading={sendLoading}
                lastSentTime={lastStudentMessageTime}
              />

              {/* CASE 2: Waiting state (no unread reply) */}
              {!latestUnreadReply && lastStudentMessageTime && <WaitingCard />}
            </>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // STAFF / ADMIN VIEW — Conversations Dashboard
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 w-full h-[calc(100vh-80px)] flex flex-col font-['Public_Sans']">

      {/* Header */}
      <div className={`mb-3 md:mb-4 ${hasActiveChat ? "hidden md:block" : "block"}`}>
        <h2 className="text-xl md:text-2xl font-bold text-original-secondary m-0">{t("contactPage.studentInquiries")}</h2>
        <p className="text-sm text-original-text-muted mt-1 mb-0">
          {t("contactPage.selectConversation")}
        </p>
      </div>

      {/* Mobile back button */}
      {hasActiveChat && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-original-primary font-semibold text-sm mb-3 md:hidden bg-transparent border-none cursor-pointer p-0 rtl:flex-row-reverse"
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} className="rtl:rotate-180" />
          {t("contactPage.backToInquiries")}
        </button>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-5 flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className={`w-full md:w-[300px] md:flex-shrink-0 ${hasActiveChat ? "hidden md:flex md:flex-col" : "flex flex-col"}`}>
          <ConversationsList
            conversations={conversations}
            selectedId={selectedConversation?.with._id ?? null}
            onSelect={(conv) => dispatch(setSelectedConversation(conv))}
            loading={loading && conversations.length === 0}
            title={t("contactPage.studentInquiries")}
          />
        </div>

        {/* Chat */}
        <div className={`flex-1 min-h-0 ${hasActiveChat ? "flex flex-col" : "hidden md:flex md:flex-col"}`}>
          <ChatWindow
            selectedConversation={selectedConversation}
            isStudent={false}
            sendLoading={sendLoading}
            onSend={handleStaffSend}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
