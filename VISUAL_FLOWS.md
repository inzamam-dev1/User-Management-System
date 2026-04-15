# 📊 VISUAL FLOW DIAGRAMS

## 1️⃣ COMPLETE LOGIN FLOW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          LOGIN PROCESS                                  │
└─────────────────────────────────────────────────────────────────────────┘

STEP 1: User Types Credentials
┌──────────────────┐
│  FRONTEND        │
│  ┌────────────┐  │
│  │ Email      │  │
│  │ user@ex.co │  │
│  │            │  │
│  │ Password   │  │
│  │ ••••••••   │  │
│  │            │  │
│  │ [Login]    │  │
│  └────────────┘  │
└──────────────────┘
        │ onClick
        ▼

STEP 2: Frontend Prepares Request
┌──────────────────────────────────────┐
│  const formData = {                  │
│    email: "user@ums.com",            │
│    password: "User@1234"             │
│  }                                   │
│                                      │
│  POST /api/auth/login                │
│  body: formData                      │
└──────────────────────────────────────┘
        │ HTTP Request
        ▼

STEP 3: Backend Receives Request
┌─────────────────────────────────┐
│  BACKEND - Controller             │
│  ┌───────────────────────────┐   │
│  │ loginController receives  │   │
│  │ req.body = {              │   │
│  │   email, password         │   │
│  │ }                         │   │
│  └───────────────────────────┘   │
└─────────────────────────────────┘
        │ Calls service
        ▼

STEP 4: Service Does Business Logic
┌──────────────────────────────────────────┐
│  BACKEND - Service                       │
│                                          │
│  1. Find user by email                   │
│     const user = await                   │
│       User.findOne({ email })            │
│                                          │
│  2. Compare passwords                    │
│     if (!bcrypt.compare(password, hash)) │
│       throw "Wrong password!"            │
│                                          │
│  3. Generate tokens                      │
│     accessToken = jwt.sign(...)          │
│     refreshToken = jwt.sign(...)         │
│                                          │
│  4. Save refresh token to DB             │
│     user.refreshToken = refreshToken     │
│     await user.save()                    │
│                                          │
│  5. Return result                        │
│     return { user, accessToken,          │
│              refreshToken }              │
└──────────────────────────────────────────┘
        │ Response
        ▼

STEP 5: Backend Sends Response
┌─────────────────────────────────────────┐
│  Response Status: 200 OK                │
│                                         │
│  {                                      │
│    "data": {                            │
│      "user": {                          │
│        "_id": "123abc",                 │
│        "name": "John User",             │
│        "email": "user@ums.com",         │
│        "role": "user"                   │
│      },                                 │
│      "accessToken":                     │
│        "eyJhbGciOiJIUzI1NiIs...",      │
│      "refreshToken":                    │
│        "eyJhbGciOiJIUzI1NiIs..."       │
│    }                                    │
│  }                                      │
└─────────────────────────────────────────┘
        │ HTTP Response
        ▼

STEP 6: Frontend Stores Tokens
┌──────────────────────────────────────┐
│  FRONTEND - AuthContext               │
│                                      │
│  localStorage.setItem(               │
│    "accessToken",                    │
│    response.accessToken              │
│  )                                   │
│                                      │
│  localStorage.setItem(               │
│    "refreshToken",                   │
│    response.refreshToken             │
│  )                                   │
│                                      │
│  setUser(response.user)              │
│  setLoading(false)                   │
└──────────────────────────────────────┘
        │ State Updated
        ▼

STEP 7: Navigate to Dashboard
┌──────────────────────┐
│  FRONTEND            │
│  ┌────────────────┐  │
│  │ Dashboard      │  │
│  │                │  │
│  │ Welcome,       │  │
│  │ John User!     │  │
│  │                │  │
│  │ [View Profile] │  │
│  │ [Logout]       │  │
│  └────────────────┘  │
└──────────────────────┘
        ✅ SUCCESS
```

---

## 2️⃣ API REQUEST WITH TOKEN

```
┌────────────────────────────────────────────────────────────────┐
│          HOW FRONTEND TALKS TO BACKEND SECURELY                │
└────────────────────────────────────────────────────────────────┘

USER CLICKS "VIEW PROFILE"
        │
        ▼
┌─────────────────────────────────┐
│  FRONTEND (React Component)     │
│  useEffect(() => {              │
│    api.get("/auth/me")          │
│  })                             │
└─────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│  AXIOS INTERCEPTOR (axios.config.js) │
│                                      │
│  api.interceptors.request.use(...)   │
│  {                                   │
│    const token = localStorage        │
│      .getItem("accessToken")         │
│                                      │
│    config.headers.Authorization =    │
│      "Bearer " + token               │
│                                      │
│    return config                     │
│  }                                   │
└──────────────────────────────────────┘
        │ Request with token
        ▼
┌────────────────────────────────────────────┐
│  HTTP REQUEST HEADERS                      │
│  GET /api/auth/me                          │
│  Authorization: Bearer eyJhbGciOiJIUzI1... │
│  Content-Type: application/json            │
│  Host: localhost:5000                      │
└────────────────────────────────────────────┘
        │ Server receives
        ▼
┌──────────────────────────────────────┐
│  BACKEND - protect MIDDLEWARE        │
│                                      │
│  1. Extract token from header        │
│     token = "eyJhbGciOiJIUzI1..."   │
│                                      │
│  2. Verify token is valid            │
│     const decoded =                  │
│       jwt.verify(token, SECRET)      │
│     ✅ Token valid!                  │
│                                      │
│  3. Fetch user from DB               │
│     const user =                     │
│       await User.findById(decoded.id)│
│     ✅ User exists!                  │
│                                      │
│  4. Attach to request                │
│     req.user = user                  │
│                                      │
│  5. Continue                         │
│     next()                           │
└──────────────────────────────────────┘
        │ Middleware passed
        ▼
┌──────────────────────────┐
│  BACKEND - Controller    │
│  getMe(req, res) {       │
│    return res.json({     │
│      user: req.user      │
│    })                    │
│  }                       │
└──────────────────────────┘
        │ Response
        ▼
┌────────────────────────────────────┐
│  RESPONSE 200 OK                   │
│  {                                 │
│    "_id": "123",                   │
│    "name": "John User",            │
│    "email": "user@ums.com",        │
│    "role": "user",                 │
│    "createdAt": "2024-01-15"       │
│  }                                 │
└────────────────────────────────────┘
        │ Axios receives
        ▼
┌────────────────────────────────────┐
│  FRONTEND - React Component        │
│  setUser(response.data)            │
│                                    │
│  Display:                          │
│  ┌──────────────────────────────┐  │
│  │ Profile                      │  │
│  │ Name: John User              │  │
│  │ Email: user@ums.com          │  │
│  │ Role: user                   │  │
│  │                              │  │
│  │ [Edit Profile]  [Change Pass]│  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
        ✅ SUCCESS
```

---

## 3️⃣ TOKEN EXPIRY & AUTO-REFRESH

```
┌────────────────────────────────────────────────────────────────┐
│        WHAT HAPPENS WHEN ACCESS TOKEN EXPIRES                  │
└────────────────────────────────────────────────────────────────┘

T = 0 min
┌──────────────────────────┐
│ User logs in             │
│ GET accessToken (15 min) │
│ GET refreshToken (7 day) │
└──────────────────────────┘
        │
        ▼
T = 8 min
┌──────────────────────────┐
│ User clicks something    │
│ accessToken still valid  │
│ Request succeeds ✅      │
└──────────────────────────┘
        │
        ▼
T = 14 min 59 sec
┌─────────────────────────────────┐
│ User clicks API endpoint        │
│ accessToken expires at T=15!    │
│                                 │
│ Axios detects this:             │
│ "Response was 401"              │
│                                 │
│ Auto-refresh trigger ⚡         │
└─────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────┐
│ AXIOS RESPONSE INTERCEPTOR             │
│                                        │
│ if (error.status === 401) {            │
│   const newTokens =                    │
│     await api.post("/auth/refresh", {  │
│       refreshToken: stored token       │
│     })                                 │
│                                        │
│   saveTokens(newTokens)                │
│                                        │
│   // RETRY original request            │
│   return api.request(originalRequest)  │
│ }                                      │
└────────────────────────────────────────┘
        │
        ▼
T = 15 min
┌──────────────────────────────────┐
│ BACKEND - refreshAccessToken     │
│                                  │
│ 1. Get refresh token from request│
│    const {refreshToken} = req    │
│                                  │
│ 2. Verify it's valid             │
│    jwt.verify(refreshToken, ...) │
│                                  │
│ 3. Check it's in DB              │
│    user.refreshToken === token?  │
│                                  │
│ 4. Generate new tokens           │
│    const newAccessToken = ...    │
│    const newRefreshToken = ...   │
│                                  │
│ 5. Save new refresh token        │
│    user.refreshToken = newRT     │
│    await user.save()             │
│                                  │
│ 6. Return new tokens             │
│    return { accessToken, ... }   │
└──────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ FRONTEND - Axios                  │
│                                   │
│ localStorage.setItem(             │
│   "accessToken",                  │
│   newAccessToken                  │
│ )                                 │
│                                   │
│ // Now retry original request     │
│ return api.request(originalRequest│
│   with new token)                 │
└───────────────────────────────────┘
        │
        ▼
T = 15 min 2 sec
┌──────────────────────────┐
│ ORIGINAL REQUEST RETRIED │
│ with new accessToken     │
│                          │
│ Result: SUCCESS ✅       │
│                          │
│ User never knew it       │
│ happened!                │
└──────────────────────────┘
        │
        ▼
T = 30 min
┌────────────────────────┐
│ New token expires      │
│ (15 min from refresh)  │
│ Auto-refresh happens   │
│ again...               │
└────────────────────────┘
        │
        ▼
... (repeats every 15 min)
        │
        ▼
T = 7 days
┌─────────────────────────┐
│ Refresh token expires!  │
│ Auto-refresh FAILS      │
│ ❌ Redirect to login    │
│                         │
│ "Please log in again"   │
└─────────────────────────┘
```

---

## 4️⃣ ROLE-BASED ACCESS CONTROL

```
┌─────────────────────────────────────────────────────────────┐
│        HOW RBAC DECIDES WHO CAN DO WHAT                     │
└─────────────────────────────────────────────────────────────┘

REQUEST: GET /api/users (View all users)

STEP 1: Check if logged in (protect middleware)
┌────────────────────────┐
│ Is token valid?        │
│                        │
│ If NO → 401 error      │
│   "Please login"       │
│                        │
│ If YES → Continue ✅   │
└────────────────────────┘
        │
        ▼
STEP 2: Check role (authorize middleware)
┌───────────────────────────────────┐
│ authorize("admin", "manager")     │
│                                   │
│ Allowed roles: admin, manager     │
│ User's role: USER                 │
│                                   │
│ Is USER in [admin, manager]?      │
│   NO ❌                           │
│                                   │
│ Return 403 error:                 │
│ "Access denied"                   │
└───────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ RESULT                           │
│                                  │
│ Response 403 Forbidden           │
│                                  │
│ "Access denied. This action      │
│  requires one of: admin,         │
│  manager"                        │
│                                  │
│ ❌ User cannot see the list      │
└──────────────────────────────────┘


---

SAME REQUEST: GET /api/users
But user is MANAGER

STEP 1: Check if logged in
┌────────────────────────┐
│ Is token valid?        │
│ User: admin@ums.com    │
│ Role: manager          │
│                        │
│ YES ✅ Continue        │
└────────────────────────┘
        │
        ▼
STEP 2: Check role
┌───────────────────────────────────┐
│ authorize("admin", "manager")     │
│                                   │
│ Is manager in [admin, manager]?   │
│ YES ✅ Continue                   │
└───────────────────────────────────┘
        │
        ▼
STEP 3: Execute controller
┌──────────────────────────────┐
│ getUsers(req, res)           │
│                              │
│ const users =                │
│   await User.find({})        │
│   .sort({ createdAt: -1 })   │
│                              │
│ return res.json(users)       │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ RESULT                           │
│                                  │
│ Response 200 OK                  │
│                                  │
│ [                                │
│   {                              │
│     name: "John User",           │
│     email: "john@ums.com",       │
│     role: "user"                 │
│   },                             │
│   {                              │
│     name: "Jane Manager",        │
│     email: "jane@ums.com",       │
│     role: "manager"              │
│   }                              │
│ ]                                │
│                                  │
│ ✅ Manager can see all users     │
└──────────────────────────────────┘
```

---

## 5️⃣ ADMIN CREATES NEW USER

```
┌──────────────────────────────────────────────────────────────┐
│     HOW ADMIN CREATES A USER WITHOUT PASSWORD                │
└──────────────────────────────────────────────────────────────┘

STEP 1: Admin fills form
┌─────────────────────────────────┐
│ Create New User Form            │
│                                 │
│ Name: Alice Johnson             │
│ Email: alice@company.com        │
│ Role: Manager                   │
│ Password: [leave blank]         │
│                                 │
│ [CREATE USER]                   │
└─────────────────────────────────┘
        │ Submit
        ▼

STEP 2: Frontend sends
┌────────────────────────────────────┐
│ POST /api/users                    │
│ {                                  │
│   name: "Alice Johnson",           │
│   email: "alice@company.com",      │
│   role: "manager"                  │
│   // NO PASSWORD!                  │
│ }                                  │
└────────────────────────────────────┘
        │
        ▼

STEP 3: Backend checks auth
┌──────────────────────────────────┐
│ protect middleware               │
│ Is admin logged in? YES ✅        │
└──────────────────────────────────┘
        │
        ▼

STEP 4: Backend checks authorization
┌──────────────────────────────────┐
│ authorize("admin")               │
│ Is user admin role? YES ✅        │
└──────────────────────────────────┘
        │
        ▼

STEP 5: Service generates password
┌──────────────────────────────────────────┐
│ createUser service:                      │
│                                          │
│ if (!password) {                         │
│   password = generatePassword()          │
│   // Generates: "Tmp@2024abc123"         │
│   autoGenerated = true                   │
│ }                                        │
└──────────────────────────────────────────┘
        │
        ▼

STEP 6: Create user with generated password
┌─────────────────────────────────────────┐
│ const user = await User.create({        │
│   name: "Alice Johnson",                │
│   email: "alice@company.com",           │
│   password: "Tmp@2024abc123",           │
│   role: "manager",                      │
│   createdBy: adminId                    │
│ })                                      │
│                                         │
│ // Pre-save hook runs:                  │
│ // password gets HASHED (bcryptjs)      │
│ // not stored as plain text!            │
└─────────────────────────────────────────┘
        │
        ▼

STEP 7: Return result with password (ONE TIME ONLY)
┌───────────────────────────────────────┐
│ Response 201 Created                  │
│                                       │
│ {                                     │
│   user: {                             │
│     _id: "789xyz",                    │
│     name: "Alice Johnson",            │
│     email: "alice@company.com",       │
│     role: "manager"                   │
│   },                                  │
│   generatedPassword: "Tmp@2024abc123" │
│ }                                     │
└───────────────────────────────────────┘
        │
        ▼

STEP 8: Frontend shows success
┌──────────────────────────────────────────────┐
│ ✅ User created successfully!                │
│                                              │
│ Generated Password: Tmp@2024abc123           │
│ [Copy to Clipboard]                          │
│ [Send Email to Alice]                        │
│                                              │
│ Please share this with Alice                 │
└──────────────────────────────────────────────┘
        │
        ▼

STEP 9: Admin sends password to Alice
┌────────────────────────────────┐
│ Email to Alice:                │
│                                │
│ Username: alice@company.com    │
│ Temp Password: Tmp@2024abc123  │
│                                │
│ Please change password on      │
│ first login.                   │
└────────────────────────────────┘
        │
        ▼

STEP 10: Alice logs in with temp password
┌──────────────────────────────────┐
│ Frontend: POST /api/auth/login   │
│ {                                │
│   email: "alice@company.com",    │
│   password: "Tmp@2024abc123"     │
│ }                                │
│                                  │
│ Backend:                         │
│ 1. Find alice                    │
│ 2. bcrypt.compare pwd → matches! │
│ 3. Generate tokens              │
│ 4. Return tokens                │
└──────────────────────────────────┘
        │
        ▼

STEP 11: Alice changes password
┌──────────────────────────────────────┐
│ Alice goes to /my-profile            │
│                                      │
│ [Change Password]                    │
│                                      │
│ Old Password: Tmp@2024abc123         │
│ New Password: AliceSecret@2024       │
│ Confirm: AliceSecret@2024            │
│                                      │
│ PATCH /api/users/me                  │
│ {                                    │
│   password: "AliceSecret@2024"       │
│ }                                    │
│                                      │
│ Backend:                             │
│ - Verify old password                │
│ - Hash new password                  │
│ - Update database                    │
│                                      │
│ ✅ Password changed!                 │
└──────────────────────────────────────┘
        │
        ▼

✅ COMPLETE
Alice can now log in with her own secret password!
```

---

## 6️⃣ ERROR HANDLING FLOW

```
REQUEST FAILS SOMEWHERE

┌──────────────────────────┐
│ Backend Route Handler    │
│                          │
│ try {                    │
│   // Do something        │
│   const user =           │
│     User.findOne(...)    │
│                          │
│   // Throws error if     │
│   // user not found      │
│ } catch (err) {          │
│   next(err) ← Pass error │
│ }                        │
└──────────────────────────┘
        │
        ▼

┌───────────────────────────────────────┐
│ Error Passes Through Middleware Chain │
│                                       │
│ Each middleware can catch/handle:     │
│ - protect middleware (auth errors)    │
│ - authorize middleware (permission)   │
│ - validate middleware (input errors)  │
└───────────────────────────────────────┘
        │
        ▼

┌─────────────────────────────────┐
│ Error Middleware (last)         │
│                                 │
│ export const errorHandler =     │
│   (err, req, res, next) => {    │
│                                 │
│   const status = err.statusCode │
│     || 500                      │
│   const message = err.message   │
│                                 │
│   res.status(status).json({     │
│     success: false,             │
│     status,                     │
│     message                     │
│   })                            │
│ }                               │
└─────────────────────────────────┘
        │
        ▼

┌──────────────────────────────────────┐
│ Response Sent to Frontend            │
│                                      │
│ Example 1 - User Not Found:          │
│ {                                    │
│   success: false,                    │
│   status: 404,                       │
│   message: "User not found."         │
│ }                                    │
│                                      │
│ Example 2 - Wrong Password:          │
│ {                                    │
│   success: false,                    │
│   status: 401,                       │
│   message: "Invalid email or pwd"    │
│ }                                    │
│                                      │
│ Example 3 - Access Denied:           │
│ {                                    │
│   success: false,                    │
│   status: 403,                       │
│   message: "Access denied"           │
│ }                                    │
└──────────────────────────────────────┘
        │
        ▼

┌──────────────────────────────┐
│ Frontend Receives Error      │
│                              │
│ catch (err) {                │
│   const message =            │
│     err.response?.data?.msg  │
│     || "Something went wrong"│
│                              │
│   toast.error(message)       │
│ }                            │
│                              │
│ ┌────────────────────────┐   │
│ │ ❌ ...error message... │   │
│ └────────────────────────┘   │
└──────────────────────────────┘
        │
        ▼
USER SEES ERROR MESSAGE ✅
```

---

## 7️⃣ PERMISSION MATRIX

```
┌────────────────────────────────────────────────────────────┐
│                    PERMISSION MATRIX                       │
├─────────────────────────┬──────────┬─────────┬──────────┤
│ ACTION                  │ USER     │ MANAGER │  ADMIN   │
├─────────────────────────┼──────────┼─────────┼──────────┤
│ View own profile        │ ✅       │ ✅      │ ✅       │
│ Update own profile      │ ✅       │ ✅      │ ✅       │
│ Change own password     │ ✅       │ ✅      │ ✅       │
│                         │          │         │          │
│ View all users          │ ❌       │ ✅      │ ✅       │
│ Search users            │ ❌       │ ✅      │ ✅       │
│ View user details       │ ❌       │ ✅      │ ✅       │
│ View audit trail        │ ❌       │ ✅      │ ✅       │
│                         │          │         │          │
│ Create new user         │ ❌       │ ❌      │ ✅       │
│ Update any user         │ ❌       │ ✅      │ ✅       │
│ Deactivate user         │ ❌       │ ✅      │ ✅       │
│ Delete user (perm)      │ ❌       │ ❌      │ ✅       │
│ Change user role        │ ❌       │ ❌      │ ✅       │
│ Manage system settings  │ ❌       │ ❌      │ ✅       │
└────────────────────────────────────────────────────────────┘

CODE EXAMPLE:
// User routes are protected by middleware

router.get("/", 
  protect,                           // Step 1: Verify logged in
  authorize("admin", "manager"),    // Step 2: Check role
  getUsers                          // Step 3: Run controller
);

// If all checks pass → controller runs
// If any check fails → error response sent
```

---

## SUMMARY OF ALL FLOWS

```
┌─────────────────────────────────────────────────────────┐
│ START HERE: User interacts with app                    │
└─────────────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    LOGIN       VIEW PAGE      MAKE REQUEST
    Flow #1     (Protected)    (with token)
    
                              │ Token expired?
                              ▼ YES
                              Flow #3
                              (auto-refresh)
    
                              │ Still valid?
                              ▼ YES
                              Flow #2
                              (add token to header)
    
                                    │
                                    ▼
                                BACKEND
                                  │
                        ┌─────────┼─────────┐
                        ▼         ▼         ▼
                      Protect  Authorize   Validate
                      (auth)   (RBAC)      (input)
                        │         │         │
                        └─────────┼─────────┘
                                  ▼
                        Execute Controller
                                  │
                                  ▼
                        Call Service (logic)
                                  │
                                  ▼
                        Query Database
                                  │
                        ┌─────────┴─────────┐
                        ▼                   ▼
                      SUCCESS            ERROR
                        │                   │
                        ▼                   ▼
                    Send Data        Flow #7
                                  (error handling)
                        │                   │
                        └─────────┬─────────┘
                                  ▼
                            FRONTEND
                                  │
                        ┌─────────┴─────────┐
                        ▼                   ▼
                    Update UI          Show Error
                    (display)          (toast)
                        │                   │
                        └─────────┬─────────┘
                                  ▼
                            USER SEES RESULT

That's the complete application flow!
```

---

Good luck explaining these to your interviewer! 🚀
