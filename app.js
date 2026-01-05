
//const PASSWORD = "1234";   // you can change this password
// Set default password if not already set
if (!localStorage.getItem("appPassword")) {
    localStorage.setItem("appPassword", "1234"); // default password
}


function checkPassword() {
    const input = document.getElementById("passwordInput").value;
    const error = document.getElementById("errorMsg");
    const savedPassword = localStorage.getItem("appPassword");

    if (input === savedPassword) {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("appContent").style.display = "block";
        error.innerText = "";
    } else {
        error.innerText = "Wrong password. Try again.";
    }
}


let files = JSON.parse(localStorage.getItem("files")) || [];
const fileList = document.getElementById("fileList");

showFiles();

function addFile() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];

    // reset input so same file can be uploaded again
    input.value = "";

    if (!file) {
        alert("Please select a file");
        return;
    }

    // check file extension instead of mime type (more reliable)
    const fileName = file.name.toLowerCase();

    if (
    !fileName.endsWith(".pdf") &&
    !fileName.endsWith(".doc") &&
    !fileName.endsWith(".docx") &&
    !fileName.endsWith(".zip") &&
    !fileName.endsWith(".jpg") &&
    !fileName.endsWith(".jpeg") &&
    !fileName.endsWith(".png") &&
    !fileName.endsWith(".heic") &&
    !fileName.endsWith(".heif")
) {
    alert("Only PDF, DOC, DOCX, ZIP, JPG, PNG, HEIC images are allowed");
    return;
}


    // size limit 10 MB
    if (file.size > 10 * 1024 * 1024) {
        alert("File must be less than 10 MB");
        return;
    }

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    const reader = new FileReader();

    reader.onprogress = function (event) {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = percent + "%";
            progressText.innerText = percent + "%";
        }
    };

    reader.onload = function () {
        files.push({
            name: file.name,
            data: reader.result
        });

        localStorage.setItem("files", JSON.stringify(files));
        showFiles();

        // reset progress
        progressBar.style.width = "0%";
        progressText.innerText = "0%";
    };

    reader.readAsDataURL(file);
}



function showFiles() {
    fileList.innerHTML = "";

    files.forEach((file, index) => {
        const card = document.createElement("div");
        card.className = "file-card";

        const name = file.name.toLowerCase();
        let previewHTML = "";

        // Image preview
        if (
            name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png") ||
            name.endsWith(".heic") ||
            name.endsWith(".heif")
        ) {
            previewHTML = `<img src="${file.data}" class="preview-img">`;
        }

        // PDF preview
        if (name.endsWith(".pdf")) {
            previewHTML = `<button onclick="openPDF('${file.data}')">Preview PDF</button>`;
        }

        // DOC / EXCEL preview
        if (
    name.endsWith(".doc") ||
    name.endsWith(".docx") ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsx")
) {
    previewHTML = `<span style="font-size:14px;">
        Preview not supported locally<br>
        Please download and open in MS Word / Excel
    </span>`;
}


        card.innerHTML = `
            ${previewHTML}
            <p class="file-name">${file.name}</p>
            <a href="${file.data}" download="${file.name}">Download</a>
            <button onclick="deleteFile(${index})">Delete</button>
        `;

        fileList.appendChild(card);
    });
}





function deleteFile(index) {
    files.splice(index, 1);
    localStorage.setItem("files", JSON.stringify(files));
    showFiles();
}
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    document.getElementById("themeToggle").innerText =
        isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").innerText = "☀️ Light Mode";
}
function openPDF(data) {
    const win = window.open();
    win.document.write(
        `<iframe src="${data}" style="width:100%; height:100%; border:none;"></iframe>`
    );
}
function logout() {
    document.getElementById("appContent").style.display = "none";
    document.getElementById("lockScreen").style.display = "flex";
    document.getElementById("passwordInput").value = "";
    document.getElementById("errorMsg").innerText = "";
}

function changePassword() {
    const oldPass = document.getElementById("oldPass").value;
    const newPass = document.getElementById("newPass").value;
    const msg = document.getElementById("passMsg");

    const savedPassword = localStorage.getItem("appPassword");

    if (oldPass !== savedPassword) {
        msg.style.color = "red";
        msg.innerText = "Old password is incorrect";
        return;
    }

    if (newPass.length < 4) {
        msg.style.color = "red";
        msg.innerText = "New password must be at least 4 characters";
        return;
    }

    localStorage.setItem("appPassword", newPass);
    msg.style.color = "green";
    msg.innerText = "Password updated successfully";

    document.getElementById("oldPass").value = "";
    document.getElementById("newPass").value = "";
}
