// 1) In Supabase: create a project, then copy Project URL and anon/public key.
// 2) Paste them below. Never put your service_role key in a website.
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";

let supabaseClient = null;
if (window.supabase && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_")) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const modal = document.getElementById("authModal");
const form = document.getElementById("authForm");
const message = document.getElementById("formMessage");
const title = document.getElementById("modalTitle");
const subtitle = document.getElementById("modalSubtitle");
const submit = document.getElementById("submitAuth");
const password = document.getElementById("password");
const email = document.getElementById("email");
const switchMode = document.getElementById("switchMode");
const switchText = document.getElementById("switchText");
const forgot = document.getElementById("forgotPassword");
let mode = "login";

function showMessage(text, error=false) { message.textContent = text; message.style.color = error ? "#ff9999" : "#e4c77f"; }
function openAuth(nextMode) {
  mode = nextMode; message.textContent = "";
  const signup = mode === "signup";
  title.textContent = signup ? "ساخت حساب کاربری" : "ورود به حساب";
  subtitle.textContent = signup ? "با ایمیل خود در آکادمی EMO ثبت‌نام کن." : "برای ادامه مسیر یادگیری وارد حساب کاربری‌ات شو.";
  submit.textContent = signup ? "ثبت‌نام" : "ورود";
  switchText.textContent = signup ? "قبلاً حساب ساخته‌ای؟" : "حساب کاربری نداری؟";
  switchMode.textContent = signup ? "وارد شو" : "ثبت‌نام کن";
  password.autocomplete = signup ? "new-password" : "current-password";
  forgot.classList.toggle("hidden", signup);
  modal.classList.remove("hidden");
}
function closeAuth(){ modal.classList.add("hidden"); }
document.getElementById("openLogin").onclick = () => openAuth("login");
document.getElementById("openSignup").onclick = () => openAuth("signup");
document.getElementById("heroLogin").onclick = () => openAuth("login");
document.getElementById("closeModal").onclick = closeAuth;
modal.addEventListener("click", e => { if(e.target === modal) closeAuth(); });
switchMode.onclick = () => openAuth(mode === "login" ? "signup" : "login");
document.addEventListener("keydown", e => { if(e.key === "Escape") closeAuth(); });

function updateUser(user) {
  const chip = document.getElementById("userChip");
  document.getElementById("openLogin").classList.toggle("hidden", !!user);
  document.getElementById("openSignup").classList.toggle("hidden", !!user);
  chip.classList.toggle("hidden", !user);
  if(user) document.getElementById("userEmail").textContent = user.email;
}
async function refreshSession() {
  if(!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  updateUser(data.session?.user || null);
}
document.getElementById("logoutBtn").onclick = async () => {
  if(!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  if(error) alert(error.message); else updateUser(null);
};

form.addEventListener("submit", async e => {
  e.preventDefault();
  if(!supabaseClient) {
    showMessage("اتصال هنوز تنظیم نشده است. ابتدا آدرس پروژه و کلید عمومی Supabase را در فایل app.js وارد کن.", true);
    return;
  }
  submit.disabled = true; submit.textContent = "لطفاً صبر کن...";
  try {
    if(mode === "signup") {
      const { data, error } = await supabaseClient.auth.signUp({ email: email.value.trim(), password: password.value });
      if(error) throw error;
      if(data.session) { updateUser(data.user); showMessage("ثبت‌نام موفق بود!"); setTimeout(closeAuth, 900); }
      else showMessage("ثبت‌نام انجام شد. ایمیلت را برای تأیید حساب بررسی کن.");
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email: email.value.trim(), password: password.value });
      if(error) throw error;
      updateUser(data.user); showMessage("با موفقیت وارد شدی!"); setTimeout(closeAuth, 700);
    }
  } catch(err) { showMessage(err.message || "خطایی رخ داد. دوباره تلاش کن.", true); }
  finally { submit.disabled = false; submit.textContent = mode === "signup" ? "ثبت‌نام" : "ورود"; }
});
forgot.onclick = async () => {
  if(!supabaseClient) return showMessage("ابتدا اتصال Supabase را در app.js تنظیم کن.", true);
  if(!email.value.trim()) return showMessage("ابتدا ایمیلت را وارد کن.", true);
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email.value.trim(), { redirectTo: window.location.origin });
  showMessage(error ? error.message : "اگر این ایمیل ثبت شده باشد، لینک بازیابی برای آن ارسال می‌شود.", !!error);
};

document.getElementById("menuToggle").onclick = () => document.getElementById("mainNav").classList.toggle("open");
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
if(supabaseClient) {
  refreshSession();
  supabaseClient.auth.onAuthStateChange((_event, session) => updateUser(session?.user || null));
}
