"use client";

import gsap from "gsap";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useEffect, useRef, useState } from "react";

const links = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Work",
    url: "/work",
  },
  {
    title: "News",
    url: "/news",
  },
  {
    title: "Contact",
    url: "/contact",
  },
];

const Header = () => {
  const lastScrollRef = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      // Hide the menu if the user has scrolled more than 100px
      if (Math.abs(lastScrollRef.current - window.scrollY) > 100) {
        setIsActive(false);
      }

      setIsScrolled(window.scrollY >= 100);
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    if (isActive) {
      lastScrollRef.current = window.scrollY;
    }

    const width = isActive ? header.getBoundingClientRect().width : 100;

    gsap.to(header, {
      "--width": `${width}px`,
      duration: 0.5,
      ease: "expo.out",
      delay: !isScrolled && isActive ? 0.2 : 0,
    });
  }, [isActive]);

  const clickHandler = () => {
    setIsActive(!isActive);
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""} ${isActive ? styles.headerActive : ""}`}
      ref={headerRef}>
      <ul
        className={`${styles.headerMenu} ${isScrolled ? styles.headerMenuScrolled : ""} ${
          isActive ? styles.headerMenuActive : ""
        }`}>
        {links.map((link) => {
          return (
            <li key={link.title}>
              <Link
                href={link.url}
                onClick={() => {
                  setIsActive(false);
                }}>
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        className={`${styles.menuButton} ${isScrolled ? styles.menuButtonScrolled : ""} ${
          isActive ? styles.menuButtonActive : ""
        }`}
        onClick={clickHandler}>
        <span>Menu</span>
      </button>
    </header>
  );
};

export default Header;
