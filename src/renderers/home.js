const { remote } = require("electron");
const axios = require("axios");
const authService = remote.require("./services/auth-service");
const authProcess = remote.require("./main/auth-process");


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        icon:__dirname+'/Images/Forgeapp.png',
        webSecurity: false
    });

    // and load the index.html of the app.
    mainWindow.loadURL(path.join(__dirname, 'index.html'));

    const template = [
        {
            label: "Reload", role: 'reload'
        },
        {
            label: "Home", click(menuItem, browserWindow, event) {
                mainWindow.loadFile(path.join(__dirname, 'index.html'))
            }
        },
        {
            label: "Connetions",
            submenu: [
                {
                    label: "Gmail", click(menuItem, browserWindow, event) {
                        mainWindow.loadURL("https://gmail.com")
                    }
                },
                {
                    label: "Messenger", click(menuItem, browserWindow, event) {
                        mainWindow.loadURL("https://www.messenger.com/")
                    }
                },
                {
                    label: "Whatsapp", click(menuItem, browserWindow, event) {
                        mainWindow.loadURL("https://web.whatsapp.com/")
                    }
                },
                {
                    label: "Discord", click(menuItem, browserWindow, event) {
                        mainWindow.loadURL("https://discordapp.com/login")
                    }
                },
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};


app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



const webContents = remote.getCurrentWebContents();

webContents.on("dom-ready", () => {
  const profile = authService.getProfile();
  document.getElementById("picture").src = profile.picture;
  document.getElementById("name").innerText = profile.name;
  document.getElementById("success").innerText =
    "You successfully used OpenID Connect and OAuth 2.0 to authenticate.";
});

document.getElementById("logout").onclick = () => {
  authProcess.createLogoutWindow();
  remote.getCurrentWindow().close();
};

document.getElementById("secured-request").onclick = () => {
  axios
    .get("http://localhost:3000/private", {
      headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    })
    .then((response) => {
      const messageJumbotron = document.getElementById("message");
      messageJumbotron.innerText = response.data;
      messageJumbotron.style.display = "block";
    })
    .catch((error) => {
      if (error) throw new Error(error);
    });
};
