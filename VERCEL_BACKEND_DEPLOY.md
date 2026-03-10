# Vercel par Backend Deploy ka Tareeqa

Backend (`server/` folder) ko **alag Vercel project** ki tarah deploy karo taake `fixonicc.vercel.app/api` proxy se kaam kare.

---

## Step 1: Vercel Dashboard

1. [vercel.com](https://vercel.com) par login karo.
2. **Add New...** → **Project** par click karo.

---

## Step 2: Repo Select karo

1. **Import Git Repository** se apna **fixonic** wala repo select karo (jo abhi frontend ke liye use ho raha hai).
2. **Import** par click karo.

---

## Step 3: Backend Project Configure karo

1. **Project Name** – tumhara backend URL: `https://fixonicc-o2t4.vercel.app` (Root `vercel.json` mein yahi URL proxy ke liye set hai.)

2. **Root Directory** set karo:
   - **Root Directory** ke saamne **Edit** click karo.
   - `server` type karo (sirf backend folder).
   - **Continue** karo.

3. **Framework Preset**: **Other** rakho (ya **Vercel** default).

4. **Build and Output** (optional):
   - Build Command: khali chhod sakte ho ya `npm install` (Vercel auto detect karega).
   - Output Directory: khali (backend ke liye zaroori nahi).

---

## Step 4: Environment Variables add karo

**Environment Variables** section mein ye add karo (`.env` se copy karke). **Production** (aur agar chaho to Preview/Development) dono ke liye set karo:

| Name | Value |
|------|--------|
| `MONGO_URI` | `mongodb+srv://shoaib-ramzan:mongodb@fixonic.5tgd7v4.mongodb.net/fixonic` |
| `JWT_SECRET` | (apna JWT secret – .env wala) |
| `FRONTEND_URL` | `https://fixonicc.vercel.app` |
| `EMAIL_SERVICE` | `gmail` |
| `EMAIL_USER` | (apna email) |
| `EMAIL_PASS` | (Google App Password) |
| `CLOUDINARY_CLOUD_NAME` | (apna value) |
| `CLOUDINARY_API_KEY` | (apna value) |
| `CLOUDINARY_API_SECRET` | (apna value) |

**Note:** `VITE_*` wale variables backend project mein **mat** daalo (sirf frontend ke liye hain).

**Email (OTP / Resend):** Agar signup ya resend par email nahi aa raha, to backend project mein **`EMAIL_USER`** aur **`EMAIL_PASS`** zaroor set karo. `EMAIL_PASS` = Google App Password (16-character, bina spaces). Spam folder bhi check karo.

---

## Step 5: Deploy

1. **Deploy** par click karo.
2. Deploy complete hone ke baad backend URL: `https://fixonicc-o2t4.vercel.app`

---

## Step 6: Root `vercel.json` check karo

Project root (frontend wale) mein `vercel.json` mein proxy URL backend project se match hona chahiye:

- Backend URL: `https://fixonicc-o2t4.vercel.app` (root `vercel.json` mein set hai).
- Agar kabhi backend URL change ho, to root `vercel.json` mein ye line update karo:

```json
"destination": "https://YOUR-BACKEND-URL.vercel.app/api/:path*"
```

---

## Step 7: Frontend redeploy

- Frontend project (fixonicc.vercel.app) ko ek bar phir deploy karo taake sab latest ho.
- Ab `https://fixonicc.vercel.app` se login karo – request same URL par `/api` se backend tak proxy hogi.

---

## Summary

| Project | Root Directory | URL (example) |
|---------|----------------|----------------|
| Frontend | (root – khali) | `https://fixonicc.vercel.app` |
| Backend | `server` | `https://fixonicc-o2t4.vercel.app` |

Browser → `fixonicc.vercel.app/api/auth/login` → Vercel rewrite → `fixonicc-api.vercel.app/api/auth/login` → response wapas frontend.
