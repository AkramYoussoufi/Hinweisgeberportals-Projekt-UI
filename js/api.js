(function () {
  const el = document.createElement("div");
  el.id = "global-spinner";
  el.innerHTML = '<div class="spinner-ring"></div>';
  document.addEventListener("DOMContentLoaded", () =>
    document.body.appendChild(el),
  );

  let _pending = 0;
  window._spinnerShow = function () {
    _pending++;
    el.classList.add("active");
  };
  window._spinnerHide = function () {
    _pending = Math.max(0, _pending - 1);
    if (_pending === 0) el.classList.remove("active");
  };
})();

const api = {
  _token: null,

  init() {
    this._token = localStorage.getItem("token");
    axios.defaults.baseURL = APP_CONFIG.API_BASE;
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";
    if (this._token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + this._token;
    }

    axios.interceptors.request.use((config) => {
      window._spinnerShow();
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        window._spinnerHide();
        return response;
      },
      (error) => {
        window._spinnerHide();
        return Promise.reject(error);
      },
    );
  },

  setToken(token) {
    this._token = token;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  },

  clearToken() {
    this._token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  },

  getUser() {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  isLoggedIn() {
    return !!this._token;
  },

  // Auth
  async register(email, password, passwordConfirmation) {
    return axios.post("/auth/register", {
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  async login(email, password) {
    return axios.post("/auth/login", { email, password });
  },

  async anonymousLogin(anonToken, pin) {
    return axios.post("/auth/anonymous-login", {
      anon_token: anonToken,
      pin,
    });
  },

  async logout() {
    return axios.post("/auth/logout");
  },

  async forgotPassword(email) {
    return axios.post("/auth/forgot-password", { email });
  },

  async resetPassword(email, token, password, passwordConfirmation) {
    return axios.post("/auth/reset-password", {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  async me() {
    return axios.get("/auth/me");
  },

  // Reports
  async submitReport(data) {
    return axios.post("/reports", data);
  },

  async getReports() {
    return axios.get("/reports");
  },

  async getReport(referenceNumber) {
    return axios.get("/reports/" + referenceNumber);
  },

  // Messages
  async getMessages(referenceNumber) {
    return axios.get("/reports/" + referenceNumber + "/messages");
  },

  async sendMessage(referenceNumber, body) {
    return axios.post("/reports/" + referenceNumber + "/messages", { body });
  },

  // Attachments
  async getAttachments(referenceNumber) {
    return axios.get("/reports/" + referenceNumber + "/attachments");
  },

  async uploadAttachment(referenceNumber, file, authToken = null) {
    const formData = new FormData();
    formData.append("file", file);
    const config = {};
    if (authToken) {
      config.headers = { Authorization: "Bearer " + authToken };
    }
    return axios.post(
      "/reports/" + referenceNumber + "/attachments",
      formData,
      config,
    );
  },

  async downloadAttachment(attachmentId) {
    return axios.get("/attachments/" + attachmentId + "/download", {
      responseType: "blob",
    });
  },

  // Admin
  async adminGetReports(filters = {}) {
    return axios.get("/admin/reports", { params: filters });
  },

  async adminGetReport(referenceNumber) {
    return axios.get("/admin/reports/" + referenceNumber);
  },

  async adminUpdateStatus(referenceNumber, status) {
    return axios.patch("/admin/reports/" + referenceNumber + "/status", {
      status,
    });
  },

  async adminGetMessages(referenceNumber) {
    return axios.get("/admin/reports/" + referenceNumber + "/messages");
  },

  async adminSendMessage(referenceNumber, body) {
    return axios.post("/admin/reports/" + referenceNumber + "/messages", {
      body,
    });
  },

  async adminGetAttachments(referenceNumber) {
    return axios.get("/admin/reports/" + referenceNumber + "/attachments");
  },

  // SuperAdmin
  async superadminListAdmins() {
    return axios.get("/superadmin/admins");
  },

  async superadminCreateAdmin(email, password, role) {
    return axios.post("/superadmin/admins", {
      email,
      password,
      password_confirmation: password,
      role,
    });
  },

  async superadminDeactivateAdmin(adminId) {
    return axios.patch("/superadmin/admins/" + adminId + "/deactivate");
  },

  async superadminReactivateAdmin(adminId) {
    return axios.patch("/superadmin/admins/" + adminId + "/reactivate");
  },

  async superadminDeleteAdmin(adminId) {
    return axios.delete("/superadmin/admins/" + adminId);
  },

  async superadminChangeAdminPassword(adminId, password) {
    return axios.patch("/superadmin/admins/" + adminId + "/password", {
      password,
    });
  },

  async superadminUnlockIdentity(referenceNumber) {
    return axios.get(
      "/superadmin/reports/" + referenceNumber + "/unlock-identity",
    );
  },

  async superadminGetSettings() {
    return axios.get("/superadmin/settings");
  },

  async superadminUpdateSettings(settings) {
    return axios.patch("/superadmin/settings", settings);
  },
};
