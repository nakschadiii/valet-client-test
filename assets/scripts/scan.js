const html5QrCode = new Html5Qrcode(/* element id */ "reader");
const config = { fps: 10, qrbox: { width: 250, height: 250 } };
html5QrCode.start({ facingMode: "environment" }, config, () => {
    console.log("scan started");
});