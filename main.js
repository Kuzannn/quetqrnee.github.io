const scannerDiv = document.querySelector(".scanner");

const camera = scannerDiv.querySelector("h1 .fa-camera");
const stopCam = scannerDiv.querySelector("h1 .fa-circle-stop");

const form = scannerDiv.querySelector(".scanner-form");
const fileInput = form.querySelector("input");
const p = form.querySelector("p");
const img = form.querySelector("img");
const video = form.querySelector("video");
const content = form.querySelector(".content");

const textarea = scannerDiv.querySelector(".scanner-details textarea");
const copyBtn = scannerDiv.querySelector(".scanner-details .copy");
const closeBtn = scannerDiv.querySelector(".scanner-details .close")

//Input file
form.addEventListener("click", () => fileInput.click());

//Scan QR Code Image
fileInput.addEventListener("change", e => {
    let file = e.target.files[0];
    if(!file) return;
    fetchRequest(file);
})

function fetchRequest(file){
    let formData = new FormData();
    formData.append("file", file);

    p.innerText= "Đang quét mã QR ...";

    fetch(`https://api.qrserver.com/v1/read-qr-code/`, {
        method: "POST", body: formData
    }).then(res => res.json()).then(result => {
        let text = result[0].symbol[0].data;

        if(!text)
            return p.innerText = "Không thể quét được mã QR này .-.";

        scannerDiv.classList.add("active");
        form.classList.add("active-img");

        img.src = URL.createObjectURL(file);
        textarea.innerText = text;
    })
}

let scanner;

camera.addEventListener("click", () => {
    camera.style.display ="none"
    form.classList.add("pointerEvents");
    p.innerText = "Đang quét mã QR nèèè ...";

    scanner = new Instascan.Scanner({video: document.getElementById('preview')});

    Instascan.Camera.getCameras().then(cameras =>{
        scanner.camera = cameras[cameras.length - 1];
        scanner.start();
    }).catch(e => console.error(e));
    /*Instascan.Camera.getCameras()
        .then(cameras => {
            if(cameras.length > 0){
                scanner.start(cameras[0]).then(() => {
                    form.classList.add("active-video");
                    stopCam.style.display = "inline-block";
                })
            }else{
                alert("Bạn hông có camera hử .-.");
            }
        })
        .catch(err => console.error(err))*/

    scanner.addListener('scan', c => {
        scannerDiv.classList.add("active");
        textarea.innerText = c;
    });
});

copyBtn.addEventListener("click", () => {
    let text = textarea.textContent;
    navigator.clipboard.writeText(text);
});

closeBtn.addEventListener("click", () => stopScan());
stopCam.addEventListener("click", () => stopScan());

function stopScan(){
    p.innerText = "Tải lên mã QR để quét đêêê";

    camera.style.display ="inline-block";
    stopCam.style.display = "none";

    form.classList.remove("active-video", "active-img", "pointerEvents");
    scannerDiv.classList.remove("active");

    if(scanner) scanner.stop();
};

