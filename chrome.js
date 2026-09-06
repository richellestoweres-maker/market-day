// chrome.js
// The header and bottom tab bar, injected on every buyer page. No build step, so
// this is how we avoid pasting the same nav into six files and letting them drift.

import { paintBadge } from "./basket.js";

const LEAF = '<svg class="leaf" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3c0 9-5.5 14-11 14a6 6 0 0 1-6-6C3 6 9 3 20 3z"/></svg>';

const ICON = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h18l-2 12H5L3 8z"/><path d="M8 8a4 4 0 0 1 8 0"/></svg>',
  home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  user:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};

/** @param {{active?: 'home'|'explore'|'basket'|'profile'}} opts */
export function renderChrome(opts = {}) {
  const active = opts.active || "";
  const on = key => (active === key ? ' aria-current="page"' : "");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site-header">
      <div class="inner">
        <a href="index.html" class="wordmark">${LEAF}Market Day</a>
        <nav class="site-nav">
          <a href="explore.html"${on("explore")}>Shop</a>
          <a href="explore.html?view=farms">Farms</a>
          <a href="about.html">Our Story</a>
          <a href="seller-setup.html">For Farmers</a>
        </nav>
        <div class="header-actions">
          <a class="icon-btn" href="explore.html" aria-label="Search">${ICON.search}</a>
          <a class="icon-btn" href="basket.html" aria-label="Basket">${ICON.basket}
            <span class="dot" data-basket-count hidden>0</span></a>
          <a class="btn brick sm" href="create-account.html" data-auth-cta>Sign Up</a>
        </div>
      </div>
    </header>`);

  document.body.insertAdjacentHTML("beforeend", `
    <nav class="tabbar">
      <a href="index.html"${on("home")}>${ICON.home}Home</a>
      <a href="explore.html"${on("explore")}>${ICON.search}Explore</a>
      <a href="basket.html"${on("basket")}>${ICON.basket}<span class="dot" data-basket-count hidden>0</span>Basket</a>
      <a href="profile.html"${on("profile")}>${ICON.user}Profile</a>
    </nav>`);

  document.body.classList.add("has-tabbar");
  paintBadge();
  reflectAuth();
}

/**
 * Swap the Sign Up button for an account link once we know who is here.
 * Loaded dynamically and inside a try, so this module still has no hard
 * dependency on Firebase. If the SDK fails, the nav simply stays signed out
 * rather than disappearing, which is the whole reason it lives in its own file.
 */
async function reflectAuth() {
  try {
    const { auth } = await import("./firebase.js");
    const { onAuthStateChanged } =
      await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js");

    onAuthStateChanged(auth, user => {
      document.querySelectorAll("[data-auth-cta]").forEach(cta => {
        if (user) {
          cta.textContent = "Account";
          cta.href = "profile.html";
          cta.classList.replace("brick", "ghost");
        } else {
          cta.textContent = "Sign Up";
          cta.href = "create-account.html";
          cta.classList.replace("ghost", "brick");
        }
      });
      document.body.classList.toggle("signed-in", !!user);
    });
  } catch (err) {
    console.warn("Could not read sign in state, leaving the header signed out.", err);
  }
}

export function money(n) {
  return "$" + Number(n || 0).toFixed(2);
}

/** Straight line distance, good enough for "2.4 mi away". */
export function milesBetween(a, b) {
  if (!a?.lat || !b?.lat) return null;
  const R = 3958.8, rad = d => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
