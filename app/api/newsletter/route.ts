import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "อีเมลไม่ถูกต้อง" }, { status: 400 });
  }

  // If RESEND_API_KEY is set, send a welcome email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "EV Charge Map <hello@evrentalth.com>",
          to: [email],
          subject: "ยินดีต้อนรับสู่ EV Charge Map Thailand!",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;">
              <div style="background:#00C8FF;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
                <span style="font-size:22px;">⚡</span>
              </div>
              <h2 style="font-size:20px;color:#111;margin:0 0 8px;">ขอบคุณที่ติดตามเรา!</h2>
              <p style="color:#555;font-size:14px;line-height:1.6;">
                คุณจะได้รับอัปเดตล่าสุดเกี่ยวกับจุดชาร์จใหม่ ข่าวสาร EV และโปรโมชันพิเศษก่อนใคร
              </p>
              <a href="https://evrentalth.com/map" style="display:inline-block;margin-top:20px;background:#00C8FF;color:#08101e;font-weight:bold;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px;">
                เปิดแผนที่จุดชาร์จ →
              </a>
              <p style="color:#aaa;font-size:11px;margin-top:24px;">
                EV Charge Map Thailand · <a href="https://evrentalth.com" style="color:#aaa;">evrentalth.com</a>
              </p>
            </div>
          `,
        }),
      });

      // Also notify admin
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "EV Charge Map <hello@evrentalth.com>",
          to: ["hello@evrentalth.com"],
          subject: `Newsletter signup: ${email}`,
          text: `New subscriber: ${email}\nTime: ${new Date().toISOString()}`,
        }),
      });
    } catch (err) {
      console.error("Resend error:", err);
      // still return success — don't block user
    }
  } else {
    // No Resend key — just log (visible in Vercel logs)
    console.log(`[newsletter] new subscriber: ${email}`);
  }

  return NextResponse.json({ ok: true });
}
