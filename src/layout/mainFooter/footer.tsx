import React from "react";
import logo from "@/assets/Minya University Logo.jpg";
import { useTranslation } from "react-i18next";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-col">
          <div className="logo-section">
            <img src={logo} alt="logo" className="size-16 rounded-full" />
            <div>
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "18px",
                  lineHeight: "18px",
                  margin: "0px",
                }}
              >
                {t("miniaUniversity")}
              </h2>
              <p className="subtitle " style={{ margin: "0px" }}>
                {t("footer.internationalPortal")}
              </p>
            </div>
          </div>

          <p className="description">
            {t("footer.desc")}
          </p>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h3>{t("footer.quickLinks")}</h3>
          <ul>
            <li>{t("footer.aboutUniversity")}</li>
            <li>{t("footer.academicCalendar")}</li>
            <li>{t("footer.eLearningPortal")}</li>
            <li>{t("footer.library")}</li>
            <li>{t("footer.staffDirectory")}</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h3>{t("footer.admission")}</h3>
          <ul>
            <li>{t("footer.howToApply")}</li>
            <li>{t("footer.tuitionFees")}</li>
            <li>{t("footer.scholarships")}</li>
            <li>{t("footer.transferStudents")}</li>
            <li>{t("footer.faq")}</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h3>{t("footer.contactUs")}</h3>
          <ul className="contact">
            <li>
              <FaMapMarkerAlt /> {t("footer.address")}
            </li>
            <li>
              <FaPhoneAlt /> {t("footer.phone")}
            </li>
            <li>
              <FaEnvelope /> {t("footer.email")}
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t("footer.copyright")}</p>
        <div className="footer-links">
          <span>{t("footer.privacyPolicy")}</span>
          <span>{t("footer.termsOfUse")}</span>
          <span>{t("footer.sitemap")}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
