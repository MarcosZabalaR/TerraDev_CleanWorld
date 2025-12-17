import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Logo from "../assets/CleanWorldLogo.png";
import Avatar from "../assets/Avatar.jpg";
import {
  IconLogout,
  IconUser,
  IconChevronDown,
  IconChevronUp,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import LangSwitcher from "../components/LangSwitcher";

export default function NavBar() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatarURL, setUserAvatarURL] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { path: "/map", label: t("navbar.map") },
    { path: "/zones", label: t("navbar.zone") },
    { path: "/events", label: t("navbar.event") },
    { path: "/points", label: t("navbar.reward") },
  ];

  const navLinkClass = "font-bold block py-2 hover:underline";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      if (userData.token) {
        setIsAuthenticated(true);
        setUserName(userData.name);
        setUserAvatarURL(userData.profilePicture || null);
        return;
      }
    }
    setIsAuthenticated(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleReportClick = (e) => {
    e.preventDefault();
    const reportPath = location.pathname === "/map" ? "/map?report=true" : "/map?report=true";
    navigate(reportPath, { replace: location.pathname === "/map" });
  };

  const avatarSrc = userAvatarURL || Avatar;

  return (
    <>
      <nav className="bg-brand-primary text-white p-4 relative z-50">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <img src={Logo} className="w-8 h-8 bg-white rounded-md" />
            CleanWorld
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={navLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}

            {isAuthenticated && (
              <li>
                <button
                  onClick={handleReportClick}
                  className="px-3 py-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-neutral-200"
                >
                  {t("navbar.report")}
                </button>
              </li>
            )}
          </ul>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <LangSwitcher />

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-brand-secondary px-3 py-2 rounded-xl"
                  >
                    <img src={avatarSrc} className="w-6 h-6 rounded-full" />
                    {userName}
                    {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow">
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex w-full px-4 py-2 gap-2 hover:bg-gray-100"
                      >
                        <IconUser /> {t("navbar.profile")}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full px-4 py-2 gap-2 text-red-600 hover:bg-red-50"
                      >
                        <IconLogout /> {t("navbar.logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="font-bold">{t("navbar.login")}</Link>
                  <Link
                    to="/register"
                    className="font-bold bg-brand-light text-brand-dark px-3 py-2 rounded-xl"
                  >
                    {t("navbar.register")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile button */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-brand-secondary p-4 rounded-xl space-y-4">
            {/* Navegación */}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </div>

            <hr className="border-white/20" />

            {/* Usuario */}
            <div className="flex flex-col gap-3 pt-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex py-2 font-bold bg-brand-light text-brand-dark justify-center rounded-xl"
                  >
                    <IconUser /> {t("navbar.profile")}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex py-2 font-bold bg-brand-dark text-brand-light justify-center rounded-xl"
                  >
                    <IconLogout /> {t("navbar.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 font-bold bg-brand-light text-brand-dark text-center rounded-xl"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="py-2 font-bold bg-brand-dark text-brand-light text-center rounded-xl"
                  >
                    {t("navbar.register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Botón Reportar zona en móvil, centrado justo debajo del navbar */}
      {!isMobileMenuOpen && isAuthenticated && (
        <div className="fixed md:hidden top-21 left-0 w-full flex justify-center z-50">
          <button
            onClick={handleReportClick}
            className="px-4 py-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-neutral-200"
          >
            {t("navbar.report")}
          </button>
        </div>
      )}
    </>
  );
}
