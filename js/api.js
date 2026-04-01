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

  async uploadAttachment(referenceNumber, file) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(
      "/reports/" + referenceNumber + "/attachments",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
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
};
