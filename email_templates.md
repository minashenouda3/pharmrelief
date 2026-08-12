# PharmRelief — Supabase Email Templates

Paste each into **Supabase → Authentication → Emails**, replacing the
default template for that type.

## Why these help with spam placement

Default Supabase templates are a bare link with almost no content. Spam
filters score that pattern poorly — it looks like phishing. These
templates add the things filters actually weigh: real sender identity, a
physical address, a plain explanation of why the message was sent, an
unsubscribe-equivalent line, and enough legitimate text that the
link-to-content ratio looks normal.

They will not fix reputation on their own. A domain that sent its first
email today has no history, and Hotmail/Outlook is the harshest judge of
that. Placement improves as real recipients open and reply.

---

## 1. Confirm signup

**Subject:** `Confirm your PharmRelief account`

```html
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:36px;">
        <tr><td>
          <div style="font-size:22px;font-weight:700;color:#0f766e;margin-bottom:24px;">
            Pharm<span style="color:#0d9488;font-style:italic;">Relief</span>
          </div>

          <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;font-weight:600;">
            Confirm your email address
          </h1>

          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
            Thanks for registering with PharmRelief, Ontario's relief shift
            platform for pharmacies and pharmacists. Please confirm this
            email address so we can activate your account.
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
            <tr><td style="background:#0d9488;border-radius:8px;">
              <a href="{{ .ConfirmationURL }}"
                 style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                Confirm my email
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#64748b;">
            If the button doesn't work, copy this address into your browser:<br>
            <span style="color:#0d9488;word-break:break-all;">{{ .ConfirmationURL }}</span>
          </p>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#64748b;">
            This link expires in 24 hours. If you didn't create a
            PharmRelief account, you can safely ignore this email and no
            account will be activated.
          </p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">

          <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
            PharmRelief<br>
            1-30 Lesmill Road, North York, ON, Canada M3B 2T5<br>
            1-888-727-7672<br>
            You received this message because this address was used to
            register at pharmrelief.ca.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```

---

## 2. Reset password

**Subject:** `Reset your PharmRelief password`

```html
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:36px;">
        <tr><td>
          <div style="font-size:22px;font-weight:700;color:#0f766e;margin-bottom:24px;">
            Pharm<span style="color:#0d9488;font-style:italic;">Relief</span>
          </div>

          <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;font-weight:600;">
            Reset your password
          </h1>

          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
            We received a request to reset the password for your
            PharmRelief account. Click below to choose a new one.
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
            <tr><td style="background:#0d9488;border-radius:8px;">
              <a href="{{ .ConfirmationURL }}"
                 style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                Set a new password
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#64748b;">
            If the button doesn't work, copy this address into your browser:<br>
            <span style="color:#0d9488;word-break:break-all;">{{ .ConfirmationURL }}</span>
          </p>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#64748b;">
            This link expires in one hour and can only be used once.
            <strong>If you didn't request this</strong>, no action is
            needed — your password stays unchanged.
          </p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">

          <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
            PharmRelief<br>
            1-30 Lesmill Road, North York, ON, Canada M3B 2T5<br>
            1-888-727-7672<br>
            Sent because a password reset was requested for this address
            at pharmrelief.ca.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```

---

## 3. Magic link / OTP

**Subject:** `Your PharmRelief sign-in link`

Same shell as above, with this body copy:

```html
<h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;font-weight:600;">
  Sign in to PharmRelief
</h1>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
  Use the button below to sign in. No password needed.
</p>
<!-- button block -->
<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#64748b;">
  This link expires in one hour and works once. If you didn't ask to sign
  in, you can ignore this message.
</p>
```

---

## Other deliverability steps

Roughly in order of impact:

1. **Add an MX record on the root domain.** `pharmrelief.ca` currently
   can't receive mail — only `send.pharmrelief.ca` has an MX. Filters
   check whether a sending domain accepts replies, and one that doesn't
   scores worse. Even pointing it at a forwarding service helps.

2. **Stop using `noreply@`.** It's a recognised bulk-mail signal.
   `accounts@pharmrelief.ca` or `hello@pharmrelief.ca` with a monitored
   inbox scores better, and pharmacists can actually reply.

3. **Ask your first testers to mark "not spam" and add the sender to
   contacts.** Engagement is what reputation is built from, and with five
   pilot pharmacies you have few enough recipients that this is practical.

4. **Move DMARC to `p=quarantine`** once you're confident nothing
   legitimate is failing. Currently `p=none`.

5. **Don't send a burst.** Ramping volume gradually builds reputation;
   a sudden large send to a cold domain damages it.
