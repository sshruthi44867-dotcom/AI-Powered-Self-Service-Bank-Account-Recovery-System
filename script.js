
/* =====================================================
   SMARTBANK AI - COMPLETE JAVASCRIPT
   Register | Login | Dashboard | Banking Services
   Applications | Tracking | Transactions | AI Chatbot
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. STORAGE SYSTEM
    // ==========================================

    const STORAGE = {
        users: "smartbank_users",
        current: "smartbank_current_user",
        applications: "smartbank_applications",
        transactions: "smartbank_transactions",
        balance: "smartbank_balance",
        account: "smartbank_account_locked",
        theme: "smartbank_theme",
        bank: "smartbank_selected_bank",
        notifications: "smartbank_notifications"
    };

    function getData(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function currentUser() {
        return getData(STORAGE.current, null);
    }

    function getUsers() {
        const users = getData(STORAGE.users, []);
        return Array.isArray(users) ? users : [];
    }

    function getBalance() {
        return Number(localStorage.getItem(STORAGE.balance) || 25000);
    }

    function setMessage(id, message, color) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = message;
            if (color) element.style.color = color;
        }
    }

    // ==========================================
    // 2. CREATE REGISTER PAGE
    // ==========================================

    const main = document.querySelector(".main-content");

    if (!main) {
        console.error("Main content section not found!");
        return;
    }

    if (!document.getElementById("register")) {

        const register = document.createElement("section");
        register.id = "register";
        register.className = "content-section";

        register.innerHTML = `
            <div class="section-heading">
                <div>
                    <p class="eyebrow">NEW CUSTOMER</p>
                    <h2>Create Your Account</h2>
                    <p>Register to access SmartBank AI.</p>
                </div>
            </div>

            <div class="panel login-box">
                <h3>Customer Registration</h3>

                <input id="regName" type="text" placeholder="Full Name">
                <input id="regEmail" type="email" placeholder="Email Address">
                <input id="regUsername" type="text" placeholder="Create Username">
                <input id="regPassword" type="password" placeholder="Create Password">
                <input id="regConfirmPassword" type="password" placeholder="Confirm Password">

                <button type="button" onclick="registerUser()" class="full-button">
                    Create Account
                </button>

                <p id="registerMessage"></p>
                <p>Already have an account?</p>

                <button type="button" onclick="showPage('login')">
                    Go to Login
                </button>
            </div>
        `;

        main.insertBefore(register, main.querySelector("section"));
    }

    // ==========================================
    // 3. ADD APPLICATION TRACKING PAGE
    // ==========================================

    if (!document.getElementById("tracking")) {

        const tracking = document.createElement("section");
        tracking.id = "tracking";
        tracking.className = "content-section";

        tracking.innerHTML = `
            <div class="section-heading">
                <div>
                    <p class="eyebrow">APPLICATION CENTER</p>
                    <h2>Application Tracking</h2>
                    <p>Track your submitted applications.</p>
                </div>
            </div>

            <div class="panel">
                <h3>Track Application</h3>
                <input id="trackingApplicationId" placeholder="Enter Application ID">
                <button onclick="trackApplication()">Track Now</button>
                <p id="trackingResult"></p>
            </div>

            <div class="panel">
                <h3>My Applications</h3>
                <div id="applicationList"></div>
            </div>
        `;

        main.appendChild(tracking);
    }

    // ==========================================
    // 4. SIDEBAR LINKS
    // ==========================================

    const sidebar = document.querySelector(".sidebar-nav");

    if (sidebar) {

        if (!document.getElementById("registerLink")) {
            sidebar.insertAdjacentHTML("beforeend", `
                <a href="#register" class="nav-link" id="registerLink">
                    Register
                </a>
            `);
        }

        if (!document.getElementById("trackingLink")) {
            sidebar.insertAdjacentHTML("beforeend", `
                <a href="#tracking" class="nav-link" id="trackingLink">
                    Application Tracking
                </a>
            `);
        }

        if (!document.getElementById("logoutLink")) {
            sidebar.insertAdjacentHTML("beforeend", `
                <a href="#logout" class="nav-link" id="logoutLink">
                    Logout
                </a>
            `);
        }
    }

    // ==========================================
    // 5. REGISTER FUNCTION - MULTIPLE USERS
    // ==========================================

    window.registerUser = function () {

        const name = document.getElementById("regName")?.value.trim();
        const email = document.getElementById("regEmail")?.value.trim();
        const username = document.getElementById("regUsername")?.value.trim();
        const password = document.getElementById("regPassword")?.value;
        const confirm = document.getElementById("regConfirmPassword")?.value;

        if (!name || !email || !username || !password || !confirm) {
            setMessage("registerMessage", "Please fill all fields!", "red");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("registerMessage", "Enter a valid email!", "red");
            return;
        }

        if (password.length < 6) {
            setMessage("registerMessage", "Password must have at least 6 characters!", "red");
            return;
        }

        if (password !== confirm) {
            setMessage("registerMessage", "Passwords do not match!", "red");
            return;
        }

        const users = getUsers();

        const exists = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase()
        );

        if (exists) {
            setMessage("registerMessage", "Username already exists! Choose another.", "red");
            return;
        }

        users.push({
            name,
            email,
            username,
            password
        });

        saveData(STORAGE.users, users);

        setMessage(
            "registerMessage",
            "Registration successful! Please login.",
            "green"
        );

        const loginUsername = document.getElementById("username");

        if (loginUsername) {
            loginUsername.value = username;
        }

        document.getElementById("regName").value = "";
        document.getElementById("regEmail").value = "";
        document.getElementById("regUsername").value = "";
        document.getElementById("regPassword").value = "";
        document.getElementById("regConfirmPassword").value = "";

        setTimeout(() => showPage("login"), 1000);
    };

    // ==========================================
    // 6. LOGIN FUNCTION
    // ==========================================

    window.loginUser = function () {

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        if (!usernameInput || !passwordInput) {
            console.error("Login fields are missing!");
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            setMessage("loginMessage", "Enter username and password!", "red");
            return;
        }

        const users = getUsers();

        const user = users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
        );

        if (!user) {
            setMessage("loginMessage", "Invalid username or password!", "red");
            return;
        }

        saveData(STORAGE.current, {
            name: user.name,
            email: user.email,
            username: user.username
        });

        setMessage("loginMessage", "Login successful!", "green");

        updateDashboard();
        showPage("dashboard");
    };

    // ==========================================
    // 7. DASHBOARD UPDATE
    // ==========================================

    function updateDashboard() {

        const user = currentUser();

        if (!user) return;

        const heading = document.querySelector(
            "#dashboard .section-heading > div > p:last-child"
        );

        if (heading) {
            heading.textContent = "Welcome, " + user.name + "!";
        }

        const balance = document.getElementById("accountBalance");

        if (balance) {
            balance.textContent = "₹" + getBalance().toLocaleString("en-IN");
        }

        updateAccountStatus();
    }

    // ==========================================
    // 8. LOGOUT FUNCTION
    // ==========================================

    window.logoutUser = function () {

        localStorage.removeItem(STORAGE.current);

        const username = document.getElementById("username");
        const password = document.getElementById("password");

        if (username) username.value = "";
        if (password) password.value = "";

        showPage("login");

        setMessage("loginMessage", "Logged out successfully.", "green");
    };

    // ==========================================
// 9. FIXED PAGE NAVIGATION
// ==========================================

window.showPage = function (pageId) {

    const user = currentUser();

    if (pageId === "logout") {
        window.logoutUser();
        return;
    }

    if (!user && !["login", "register"].includes(pageId)) {
        pageId = "login";
    }

    if (user && ["login", "register"].includes(pageId)) {
        pageId = "dashboard";
    }

    // Hide all content sections
    document.querySelectorAll(".content-section").forEach(section => {
        section.style.display = "none";
    });

    document.querySelectorAll(".main-content > section").forEach(section => {
        section.style.display = "none";
    });

    // Show selected page
    const selected = document.getElementById(pageId);

    if (!selected) {
        console.error("Page not found:", pageId);
        return;
    }

    selected.style.display = "block";

    // Update active sidebar link
    document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + pageId
        );
    });

    if (pageId === "dashboard") updateDashboard();
    if (pageId === "tracking") displayMyApplications();

    history.replaceState(null, "", "#" + pageId);
};


// ==========================================
// 10. FIXED SIDEBAR CLICK EVENTS
// ==========================================

document.addEventListener("click", function (event) {

    const link = event.target.closest(".sidebar-nav a");

    if (!link) return;

    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    event.preventDefault();

    const pageId = href.substring(1);

    window.showPage(pageId);

});

    // ==========================================
    // 11. PASSWORD SHOW / HIDE
    // ==========================================

    window.togglePassword = function () {

        const password = document.getElementById("password");

        if (!password) return;

        password.type =
            password.type === "password" ? "text" : "password";
    };

    // ==========================================
    // 12. FORGOT PASSWORD
    // ==========================================

    window.showForgotPassword = function () {

        const box = document.getElementById("forgotPasswordBox");

        if (box) {
            box.style.display =
                box.style.display === "none" ? "block" : "none";
        }
    };

    window.resetPassword = function () {

        const usernameInput = document.getElementById("resetUsername");
        const passwordInput = document.getElementById("newPassword");

        if (!usernameInput || !passwordInput) return;

        const username = usernameInput.value.trim();
        const newPassword = passwordInput.value;

        const users = getUsers();

        const user = users.find(u => u.username === username);

        if (!user) {
            setMessage("resetMessage", "Username not found!", "red");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("resetMessage", "Password must have 6 characters!", "red");
            return;
        }

        user.password = newPassword;
        saveData(STORAGE.users, users);

        setMessage("resetMessage", "Password updated successfully!", "green");
    };

    // ==========================================
    // 13. FINGERPRINT DEMO
    // ==========================================

    window.fingerprintLogin = function () {

        const user = currentUser();

        if (!user) {
            setMessage("fingerprintMessage", "Please login using your demo account first.", "red");
            return;
        }

        setMessage("fingerprintMessage", "Demo fingerprint simulation successful!", "green");

        showPage("dashboard");
    };
    // ==========================================
    // 14. BANK SELECTION
    // ==========================================

    window.selectBank = function () {

        const bank = document.getElementById("bankSelect")?.value;

        if (!bank) {
            alert("Please select a bank!");
            return;
        }

        localStorage.setItem(STORAGE.bank, bank);

        setMessage("bankMessage", "Selected Bank: " + bank, "green");
    };


    // ==========================================
    // 15. ACCOUNT LOCK / UNLOCK
    // ==========================================

    window.lockAccount = function () {

        const user = currentUser();

        if (!user) {
            alert("Please login first!");
            return;
        }

        localStorage.setItem(
            STORAGE.account,
            user.username
        );

        updateAccountStatus();

        setMessage(
            "accountLockMessage",
            "Your account has been locked successfully.",
            "green"
        );
    };


    window.unlockAccount = function () {

        const user = currentUser();

        if (!user) return;

        const lockedUser = localStorage.getItem(STORAGE.account);

        if (lockedUser !== user.username) {
            setMessage(
                "accountLockMessage",
                "Your account is not locked.",
                "red"
            );
            return;
        }

        localStorage.removeItem(STORAGE.account);

        updateAccountStatus();

        setMessage(
            "accountLockMessage",
            "Account unlocked successfully!",
            "green"
        );
    };


    function updateAccountStatus() {

        const user = currentUser();

        if (!user) return;

        const status = document.getElementById("accountStatus");

        const isLocked =
            localStorage.getItem(STORAGE.account) === user.username;

        if (status) {
            status.textContent = isLocked ? "Locked" : "Active";
            status.style.color = isLocked ? "red" : "green";
        }
    }


    // ==========================================
    // 16. ATM CARD GENERATION
    // ==========================================

    window.generateATMCard = function () {

        const user = currentUser();

        if (!user) {
            alert("Please login first!");
            return;
        }

        const cardNumber =
            "4567 " +
            Math.floor(1000 + Math.random() * 9000) +
            " " +
            Math.floor(1000 + Math.random() * 9000) +
            " " +
            Math.floor(1000 + Math.random() * 9000);

        const card = {
            username: user.username,
            number: cardNumber,
            holder: user.name,
            expiry: "12/30"
        };

        saveData(
            "smartbank_atm_" + user.username,
            card
        );

        displayATMCard();

        setMessage(
            "atmMessage",
            "Demo ATM card generated successfully!",
            "green"
        );
    };


    window.displayATMCard = function () {

        const user = currentUser();

        if (!user) return;

        const card = getData(
            "smartbank_atm_" + user.username,
            null
        );

        const output = document.getElementById("atmCardDetails");

        if (!output) return;

        if (!card) {
            output.textContent = "No ATM card generated.";
            return;
        }

        output.innerHTML = `
            <div class="atm-card">
                <h3>SMARTBANK AI</h3>
                <h2>${card.number}</h2>
                <p>CARD HOLDER: ${escapeHTML(card.holder)}</p>
                <p>EXPIRY: ${card.expiry}</p>
                <p>DEMO CARD - NOT VALID FOR REAL PAYMENTS</p>
            </div>
        `;
    };


    // ==========================================
    // 17. ADDRESS UPDATE
    // ==========================================

    window.updateAddress = function () {

        const user = currentUser();

        if (!user) return;

        const address =
            document.getElementById("newAddress")?.value.trim();

        if (!address) {
            setMessage("addressMessage", "Enter your address!", "red");
            return;
        }

        const users = getUsers();

        const index = users.findIndex(
            u => u.username === user.username
        );

        if (index === -1) return;

        users[index].address = address;

        saveData(STORAGE.users, users);

        setMessage(
            "addressMessage",
            "Address updated successfully!",
            "green"
        );
    };


    // ==========================================
    // 18. PIN CHANGE
    // ==========================================

    window.changePIN = function () {

        const user = currentUser();

        if (!user) return;

        const oldPIN =
            document.getElementById("oldPIN")?.value;

        const newPIN =
            document.getElementById("newPIN")?.value;

        const confirmPIN =
            document.getElementById("confirmPIN")?.value;

        const users = getUsers();

        const account = users.find(
            u => u.username === user.username
        );

        if (!account) return;

        if (!/^\d{4}$/.test(newPIN || "")) {
            setMessage("pinMessage", "PIN must contain exactly 4 digits!", "red");
            return;
        }

        if (account.pin !== oldPIN) {
            setMessage("pinMessage", "Incorrect old PIN!", "red");
            return;
        }

        if (newPIN !== confirmPIN) {
            setMessage("pinMessage", "New PIN does not match!", "red");
            return;
        }

        account.pin = newPIN;

        saveData(STORAGE.users, users);

        setMessage(
            "pinMessage",
            "Demo PIN updated successfully!",
            "green"
        );
    };


    // ==========================================
    // 19. MONEY TRANSFER
    // ==========================================

    window.transferMoney = function () {

        const user = currentUser();

        if (!user) return;

        if (localStorage.getItem(STORAGE.account) === user.username) {
            alert("Your account is locked. Transfer is disabled.");
            return;
        }

        const receiver =
            document.getElementById("receiverAccount")?.value.trim();

        const amount = Number(
            document.getElementById("transferAmount")?.value
        );

        const pin =
            document.getElementById("transferPIN")?.value;

        if (!receiver || !Number.isFinite(amount) || amount <= 0) {
            setMessage("transferMessage", "Enter valid transfer details!", "red");
            return;
        }

        if (amount > getBalance()) {
            setMessage("transferMessage", "Insufficient balance!", "red");
            return;
        }

        const users = getUsers();

        const account = users.find(
            u => u.username === user.username
        );

        if (!account || !account.pin || account.pin !== pin) {
            setMessage("transferMessage", "Incorrect transaction PIN!", "red");
            return;
        }

        const newBalance = getBalance() - amount;

        localStorage.setItem(
            STORAGE.balance,
            newBalance
        );

        const transactions = getData(
            STORAGE.transactions,
            []
        );

        transactions.push({
            id: "TXN" + Date.now(),
            username: user.username,
            type: "Transfer",
            receiver: receiver,
            amount: amount,
            date: new Date().toLocaleString(),
            status: "Successful"
        });

        saveData(STORAGE.transactions, transactions);

        setMessage(
            "transferMessage",
            "Demo transfer successful! ₹" + amount.toLocaleString("en-IN"),
            "green"
        );

        updateDashboard();
        displayTransactions();
    };


    // ==========================================
    // 20. DEPOSIT MONEY
    // ==========================================

    window.depositMoney = function () {

        const user = currentUser();

        if (!user) return;

        const amount = Number(
            document.getElementById("depositAmount")?.value
        );

        if (!Number.isFinite(amount) || amount <= 0) {
            setMessage("depositMessage", "Enter a valid amount!", "red");
            return;
        }

        localStorage.setItem(
            STORAGE.balance,
            getBalance() + amount
        );

        addTransaction("Deposit", amount);

        updateDashboard();

        setMessage(
            "depositMessage",
            "Demo deposit successful!",
            "green"
        );
    };


    // ==========================================
    // 21. WITHDRAW MONEY
    // ==========================================

    window.withdrawMoney = function () {

        const user = currentUser();

        if (!user) return;

        if (localStorage.getItem(STORAGE.account) === user.username) {
            alert("Account locked!");
            return;
        }

        const amount = Number(
            document.getElementById("withdrawAmount")?.value
        );

        if (!Number.isFinite(amount) || amount <= 0) {
            setMessage("withdrawMessage", "Enter a valid amount!", "red");
            return;
        }

        if (amount > getBalance()) {
            setMessage("withdrawMessage", "Insufficient balance!", "red");
            return;
        }

        localStorage.setItem(
            STORAGE.balance,
            getBalance() - amount
        );

        addTransaction("Withdrawal", amount);

        updateDashboard();

        setMessage(
            "withdrawMessage",
            "Demo withdrawal successful!",
            "green"
        );
    };


    // ==========================================
    // 22. TRANSACTION HELPER
    // ==========================================

    function addTransaction(type, amount) {

        const user = currentUser();

        if (!user) return;

        const transactions = getData(
            STORAGE.transactions,
            []
        );

        transactions.push({
            id: "TXN" + Date.now(),
            username: user.username,
            type: type,
            amount: amount,
            date: new Date().toLocaleString(),
            status: "Successful"
        });

        saveData(STORAGE.transactions, transactions);

        displayTransactions();
    }


    // ==========================================
    // 23. TRANSACTION HISTORY
    // ==========================================

    window.displayTransactions = function () {

        const user = currentUser();

        if (!user) return;

        const output = document.getElementById("transactionList");

        if (!output) return;

        const transactions = getData(
            STORAGE.transactions,
            []
        );

        const myTransactions = transactions.filter(
            t => t.username === user.username
        );

        if (!myTransactions.length) {
            output.textContent = "No transactions available.";
            return;
        }

        output.innerHTML = myTransactions
            .slice()
            .reverse()
            .map(t => `
                <div class="transaction-item">
                    <h4>${escapeHTML(t.type)}</h4>
                    <p>Transaction ID: ${escapeHTML(t.id)}</p>
                    <p>Amount: ₹${Number(t.amount).toLocaleString("en-IN")}</p>
                    <p>Date: ${escapeHTML(t.date)}</p>
                    <p>Status: ${escapeHTML(t.status)}</p>
                </div>
            `).join("");
    };


    // ==========================================
    // 24. BANK STATEMENT
    // ==========================================

    window.downloadStatement = function () {

        const user = currentUser();

        if (!user) return;

        const transactions = getData(
            STORAGE.transactions,
            []
        ).filter(t => t.username === user.username);

        let csv = "Transaction ID,Type,Amount,Date,Status\n";

        transactions.forEach(t => {

            const row = [
                t.id,
                t.type,
                t.amount,
                t.date,
                t.status
            ].map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(",");

            csv += row + "\n";
        });

        const blob = new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "SmartBank_Statement.csv";

        link.click();

        URL.revokeObjectURL(url);
    };


    // ==========================================
    // 25. KYC VERIFICATION
    // ==========================================

    window.submitKYC = function () {

        const user = currentUser();

        if (!user) return;

        const documentType =
            document.getElementById("kycDocumentType")?.value;

        const documentNumber =
            document.getElementById("kycDocumentNumber")?.value.trim();

        if (!documentType || !documentNumber) {
            setMessage("kycMessage", "Fill all KYC details!", "red");
            return;
        }

        const kycData = getData("smartbank_kyc", []);

        const existing = kycData.find(
            item => item.username === user.username
        );

        if (existing) {
            setMessage("kycMessage", "KYC already submitted.", "red");
            return;
        }

        kycData.push({
            username: user.username,
            documentType,
            status: "Pending",
            submittedAt: new Date().toLocaleString()
        });

        saveData("smartbank_kyc", kycData);

        setMessage(
            "kycMessage",
            "Demo KYC submitted successfully. Status: Pending.",
            "green"
        );
    };


    // ==========================================
    // 26. MOBILE NUMBER UPDATE
    // ==========================================

    window.updateMobile = function () {

        const user = currentUser();

        if (!user) return;

        const mobile =
            document.getElementById("newMobile")?.value.trim();

        if (!/^[6-9]\d{9}$/.test(mobile || "")) {
            setMessage("mobileMessage", "Enter a valid 10-digit mobile number!", "red");
            return;
        }

        const users = getUsers();

        const account = users.find(
            u => u.username === user.username
        );

        if (!account) return;

        account.mobile = mobile;

        saveData(STORAGE.users, users);

        setMessage(
            "mobileMessage",
            "Demo mobile number updated successfully!",
            "green"
        );
    };


    // ==========================================
    // 27. USER DETAILS UPDATE
    // ==========================================

    window.updateUserDetails = function () {

        const user = currentUser();

        if (!user) return;

        const name =
            document.getElementById("updatedName")?.value.trim();

        const email =
            document.getElementById("updatedEmail")?.value.trim();

        if (!name || !email) {
            setMessage("detailsMessage", "Fill all details!", "red");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("detailsMessage", "Invalid email address!", "red");
            return;
        }

        const users = getUsers();

        const account = users.find(
            u => u.username === user.username
        );

        if (!account) return;

        account.name = name;
        account.email = email;

        saveData(STORAGE.users, users);

        saveData(STORAGE.current, {
            ...user,
            name,
            email
        });

        updateDashboard();

        setMessage(
            "detailsMessage",
            "User details updated successfully!",
            "green"
        );
    };


    // ==========================================
    // 28. NOTIFICATION SYSTEM
    // ==========================================

    window.addNotification = function (message) {

        const user = currentUser();

        if (!user) return;

        const notifications = getData(
            STORAGE.notifications,
            []
        );

        notifications.push({
            username: user.username,
            message: message,
            date: new Date().toLocaleString(),
            read: false
        });

        saveData(STORAGE.notifications, notifications);

        displayNotifications();
    };


    window.displayNotifications = function () {

        const user = currentUser();

        if (!user) return;

        const output =
            document.getElementById("notificationList");

        if (!output) return;

        const notifications = getData(
            STORAGE.notifications,
            []
        ).filter(n => n.username === user.username);

        if (!notifications.length) {
            output.textContent = "No notifications.";
            return;
        }

        output.innerHTML = notifications
            .slice()
            .reverse()
            .map(n => `
                <div class="notification-item">
                    <p>${escapeHTML(n.message)}</p>
                    <small>${escapeHTML(n.date)}</small>
                </div>
            `).join("");
    };


    window.clearNotifications = function () {

        const user = currentUser();

        if (!user) return;

        const notifications = getData(
            STORAGE.notifications,
            []
        ).filter(n => n.username !== user.username);

        saveData(STORAGE.notifications, notifications);

        displayNotifications();
    };


    // ==========================================
    // 29. APPLICATION SUBMISSION
    // ==========================================

    window.submitApplication = function () {

        const user = currentUser();

        if (!user) return;

        const type =
            document.getElementById("applicationType")?.value;

        const description =
            document.getElementById("applicationDescription")?.value.trim();

        if (!type || !description) {
            setMessage("applicationMessage", "Fill all application details!", "red");
            return;
        }

        const applications = getData(
            STORAGE.applications,
            []
        );

        const application = {
            id: "APP" + Date.now(),
            username: user.username,
            type,
            description,
            status: "Submitted",
            date: new Date().toLocaleString()
        };

        applications.push(application);

        saveData(STORAGE.applications, applications);

        setMessage(
            "applicationMessage",
            "Application submitted! ID: " + application.id,
            "green"
        );

        addNotification(
            "Your application " + application.id + " was submitted."
        );

        displayMyApplications();
    };


    // ==========================================
    // 30. APPLICATION TRACKING
    // ==========================================

    window.trackApplication = function () {

        const user = currentUser();

        if (!user) return;

        const id =
            document.getElementById("trackingApplicationId")?.value.trim();

        if (!id) {
            setMessage("trackingResult", "Enter Application ID!", "red");
            return;
        }

        const applications = getData(
            STORAGE.applications,
            []
        );

        const application = applications.find(
            a => a.id === id && a.username === user.username
        );

        if (!application) {
            setMessage("trackingResult", "Application not found!", "red");
            return;
        }

        setMessage(
            "trackingResult",
            "Application: " + application.id +
            " | Type: " + application.type +
            " | Status: " + application.status,
            "green"
        );
    };


    window.displayMyApplications = function () {

        const user = currentUser();

        if (!user) return;

        const output =
            document.getElementById("applicationList");

        if (!output) return;

        const applications = getData(
            STORAGE.applications,
            []
        ).filter(a => a.username === user.username);

        if (!applications.length) {
            output.textContent = "No applications submitted.";
            return;
        }

        output.innerHTML = applications.map(a => `
            <div class="application-item">
                <h4>${escapeHTML(a.type)}</h4>
                <p>ID: ${escapeHTML(a.id)}</p>
                <p>Status: ${escapeHTML(a.status)}</p>
                <p>Date: ${escapeHTML(a.date)}</p>
            </div>
        `).join("");
    };


    // ==========================================
    // 31. DEMO APPLICATION STATUS UPDATE
    // ==========================================

    window.updateApplicationStatus = function () {

        const id =
            document.getElementById("adminApplicationId")?.value.trim();

        const status =
            document.getElementById("adminApplicationStatus")?.value;

        if (!id || !status) {
            alert("Enter application ID and status!");
            return;
        }

        const applications = getData(
            STORAGE.applications,
            []
        );

        const application = applications.find(
            a => a.id === id
        );

        if (!application) {
            alert("Application not found!");
            return;
        }

        application.status = status;

        saveData(STORAGE.applications, applications);

        const notifications = getData(
            STORAGE.notifications,
            []
        );

        notifications.push({
            username: application.username,
            message: "Application " + id + " status updated to " + status,
            date: new Date().toLocaleString(),
            read: false
        });

        saveData(STORAGE.notifications, notifications);

        alert("Application status updated!");

        displayMyApplications();
    };


    // ==========================================
    // 32. AI CHATBOT
    // ==========================================

    window.sendChatMessage = function () {

        const input =
            document.getElementById("chatInput");

        const output =
            document.getElementById("chatMessages");

        if (!input || !output) return;

        const message = input.value.trim();

        if (!message) return;

        const userMessage = document.createElement("p");

        userMessage.textContent = "You: " + message;

        output.appendChild(userMessage);

        const reply = getBankBotReply(message);

        const botMessage = document.createElement("p");

        botMessage.textContent = "SmartBank AI: " + reply;

        output.appendChild(botMessage);

        input.value = "";

        output.scrollTop = output.scrollHeight;
    };


    function getBankBotReply(message) {

        const text = message.toLowerCase();

        if (text.includes("hello") || text.includes("hi")) {
            return "Hello! Welcome to SmartBank AI. How can I help you?";
        }

        if (text.includes("balance")) {
            return currentUser()
                ? "Your demo account balance is ₹" +
                  getBalance().toLocaleString("en-IN")
                : "Please login to check your balance.";
        }

        if (text.includes("transfer")) {
            return "You can use the Money Transfer section to make a demo transfer.";
        }

        if (text.includes("pin")) {
            return "Visit the PIN Management section to update your demo PIN.";
        }

        if (text.includes("password")) {
            return "Use Forgot Password on the login page to reset your demo password.";
        }

        if (text.includes("locked") || text.includes("lock")) {
            return "Visit Account Security to manage your demo account lock.";
        }

        if (text.includes("application")) {
            return "Visit Application Tracking to check your application status.";
        }

        if (text.includes("atm") || text.includes("card")) {
            return "Visit ATM Card Services to generate a demo card.";
        }

        if (text.includes("kyc")) {
            return "Visit KYC Verification to submit your demo KYC details.";
        }

        if (text.includes("transaction")) {
            return "Visit Transaction History to view your transactions.";
        }

        if (text.includes("thank")) {
            return "You're welcome! Thank you for using SmartBank AI.";
        }

        return "I can help with login, balance, transfers, PIN, password, ATM cards, KYC and applications.";
    }


    // ==========================================
    // 33. CHATBOT ENTER KEY
    // ==========================================

    const chatInput = document.getElementById("chatInput");

    if (chatInput) {

        chatInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                event.preventDefault();
                sendChatMessage();
            }

        });
    }


    // ==========================================
    // 34. SEARCH TRANSACTIONS
    // ==========================================

    window.searchTransactions = function () {

        const user = currentUser();

        if (!user) return;

        const search =
            document.getElementById("transactionSearch")?.value.toLowerCase();

        const output =
            document.getElementById("transactionList");

        if (!output) return;

        const transactions = getData(
            STORAGE.transactions,
            []
        ).filter(t =>
            t.username === user.username &&
            (
                t.type.toLowerCase().includes(search || "") ||
                t.id.toLowerCase().includes(search || "")
            )
        );

        output.innerHTML = transactions.map(t => `
            <div class="transaction-item">
                <h4>${escapeHTML(t.type)}</h4>
                <p>${escapeHTML(t.id)}</p>
                <p>₹${Number(t.amount).toLocaleString("en-IN")}</p>
                <p>${escapeHTML(t.date)}</p>
            </div>
        `).join("") || "No matching transactions.";
    };


    // ==========================================
    // 35. DARK / LIGHT THEME
    // ==========================================

    window.toggleTheme = function () {

        document.body.classList.toggle("dark-mode");

        const theme = document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

        localStorage.setItem(STORAGE.theme, theme);
    };


    function loadTheme() {

        const theme = localStorage.getItem(STORAGE.theme);

        document.body.classList.toggle(
            "dark-mode",
            theme === "dark"
        );
    }


    // ==========================================
    // 36. PASSWORD STRENGTH CHECKER
    // ==========================================

    window.checkPasswordStrength = function () {

        const password =
            document.getElementById("regPassword")?.value || "";

        const output =
            document.getElementById("passwordStrength");

        if (!output) return;

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = [
            "Very Weak",
            "Weak",
            "Fair",
            "Good",
            "Strong",
            "Very Strong"
        ];

        output.textContent = "Password Strength: " + levels[score];
    };


    // ==========================================
    // 37. INPUT VALIDATION HELPER
    // ==========================================

    function escapeHTML(value) {

        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }


    // ==========================================
    // 38. INITIALIZE BANKING FEATURES
    // ==========================================

    function initializeBankingFeatures() {

        loadTheme();

        if (currentUser()) {

            updateDashboard();

            displayTransactions();

            displayMyApplications();

            displayNotifications();

            displayATMCard();
        }
    }

    initializeBankingFeatures();
    }); // End of DOMContentLoaded
    