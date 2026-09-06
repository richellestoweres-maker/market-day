// session.js
// Auth gate used by every signed in page. Mirrors RentEvent's suspension-check,
// with the seller record and their live documents loaded in the same pass, since
// almost every page needs to know what this seller is allowed to do.

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs }
  from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/**
 * Resolves once we know who is here.
 * @param {{require?: 'user'|'seller'|'admin'}} opts
 * @returns {Promise<{user, profile, seller, verifications}>}
 */
export function requireSession(opts = {}) {
  const need = opts.require || "user";
  return new Promise(resolve => {
    onAuthStateChanged(auth, async user => {
      if (!user) return redirect("login.html");

      const profileSnap = await getDoc(doc(db, "users", user.uid));
      const profile = profileSnap.exists() ? profileSnap.data() : null;

      if (profile?.suspended) return redirect("suspended.html");
      if (need === "admin" && profile?.role !== "admin") return redirect("index.html");

      const sellerSnap = await getDoc(doc(db, "sellers", user.uid));
      const seller = sellerSnap.exists() ? { id: user.uid, ...sellerSnap.data() } : null;

      if (need === "seller" && !seller) return redirect("seller-setup.html");

      let verifications = [];
      if (seller) {
        const q = query(collection(db, "verifications"), where("sellerId", "==", user.uid));
        verifications = (await getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
      }

      resolve({ user, profile, seller, verifications });
    });
  });
}

function redirect(page) {
  const here = location.pathname.split("/").pop();
  if (here !== page) location.replace(page);
}

export function toast(message) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2600);
}

export function fmtDate(value) {
  if (!value) return "";
  const d = value.toDate ? value.toDate() : new Date(value);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
