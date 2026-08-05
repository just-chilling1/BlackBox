# Embedding the Start-Up Specialist Popup on Any Website

The popup is available as an iframe at:

```
https://blackboxmemebersarea.com/embed/specialist-popup
```

**Why a direct visit looks blank:** the embed is intentionally empty unless the
visitor is US/Canada **and** it's Mon–Fri 08:30–17:30 Pacific. Outside that
gate the page stays transparent and the parent page never shows the iframe.

**Force-preview (QA only):** set `NEXT_PUBLIC_SPECIALIST_POPUP_PREVIEW_SECRET`
on the host, redeploy, then open:

```
https://blackboxmemebersarea.com/embed/specialist-popup?preview=YOUR_SECRET
```

Everything works exactly like in the app:

- **Criteria enforced server-side** — shows only to US/Canada IPs, Monday–Friday
  08:30am–5:30pm Pacific. Everyone else sees nothing.
- **10-minute countdown** with red urgency timer.
- **Click tracking** — every "Call Now" tap is recorded in the
  `specialist_popup_events` Supabase table.
- **Close button** hides the popup (and tells your page to hide the iframe).

## Copy-paste snippet

Put this right before `</body>` on your thank-you page:

```html
<iframe
  id="bb-specialist-popup"
  src="https://blackboxmemebersarea.com/embed/specialist-popup"
  title="BlackBox Cash Start-Up Specialist"
  style="position:fixed;inset:0;width:100%;height:100%;border:0;z-index:999999;display:none;background:transparent"
  allowtransparency="true"
></iframe>
<script>
  (function () {
    var frame = document.getElementById("bb-specialist-popup");
    window.addEventListener("message", function (e) {
      var d = e.data;
      if (d && d.type === "bb-specialist-popup") {
        frame.style.display = d.open ? "block" : "none";
      }
    });
  })();
</script>
```

How it behaves:

1. The iframe loads invisibly (`display:none`).
2. Inside the iframe, the popup calls `/api/eligibility/specialist-popup` on the
   BlackBox server using the **visitor's IP** (GeoIP → US/CA) and the current
   Pacific time.
3. If eligible, the iframe posts `{ type: "bb-specialist-popup", open: true }`
   and the snippet makes it visible.
4. When the visitor closes the popup — or the business window ends — it posts
   `open: false` and the snippet hides the iframe again.

Do **not** add `?preview=` to the thank-you page snippet unless you are QA-testing.
