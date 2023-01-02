const server = require("../../index");
const userService = require("../userService");
const dollService = require("../dollService");
const authMiddleware = require('../../middleware/userMiddleware');

const cron = require('node-cron');
const { RESISTANCE_EXHAUSTED_VALUE } = require("../../constants");
const io = server.socketIO;

events = (socket) => {
  console.log({ Clientsocket: socket.id });
  let idSocket = { idSocket: socket.id }
  //CHANGE USER DATA
  let joshua = null;

  socket.on("changeAcolitAttributes", async (data) => {
    try {
      console.log(data)
      const changedAcolit = await userService.updateUser(data)
      /*   if (data.idSocket != null) {
          const allUsers = await userService.getAllActiveUsers();
          joshua = allUsers.filter((allUsers) => {
            return allUsers.isJoshua == true;
          });
          io.to(joshua).emit("newUser", changedAcolit);
        } */
      io.emit("changeAcolitAttributes", changedAcolit);
    } catch (error) {
      console.log(error);
      //socket.emit("toastNotification", { notificationType: 'error', description: error })
      socket.emit("toastNotification", error)

    }
  });
  //CREATE NEW USER

  socket.on("createNewUser", async (data) => {
    try {
      const user = {
        ...idSocket,
        ...data
      }
      //console.log(`createNewUser Events ${user}`)
      const newUser = await authMiddleware.firebaseAuth(user);
      newUser ? socket.emit("createNewUser", newUser) : socket.emit("toastNotification", {});

    } catch (error) {
      console.log(error);
      //socket.emit("toastNotification", { notificationType: 'error', description: error })
      socket.emit("toastNotification", error)

    }
  });

  //CHANGE ACOLIT ISINSIDE

  socket.on("changeCriptStatus", async (email) => {
    try {
      //console.log(email)
      const changedAcolitIsInside = await userService.changeCryptValue(email)

      const allUsers = await userService.getAllActiveUsers();
      joshua = allUsers.filter((allUsers) => {
        return allUsers.isJoshua == true;
      });
      io.emit("changeCriptStatus", changedAcolitIsInside);

      //io.to(joshua).emit("changeCriptStatus", changedAcolitIsInside);
      //console.log(`Events Inside ${changedAcolitIsInside}`)
    } catch (error) {
      console.log(error);
      //socket.emit("toastNotification", { notificationType: 'error', description: error })
      socket.emit("toastNotification", error)


    }
  });

  //START DOLL MISSION
  socket.on("startDollMission", async () => {
    try {
      await dollService.createDollAndDollPiece()
      const newDoll = await dollService.getAllDollPieces();
      // console.log(`startDollMission Events ${newDoll}`)
      io.emit("startDollMission", newDoll);
    } catch (error) {
      console.log(error);
      //socket.emit("toastNotification", { notificationType: 'error', description: error })
      socket.emit("toastNotification", error)


    }
  })

  //CHANGE DOLL MISSION STATUS
  socket.on("changeDollMissionStatus", async (data) => {
    try {
      const changeDollMissionStatus = await dollService.updateMissionStatus(data)
      //console.log(`events ${changeDollMissionStatus}`)
      io.emit("changeDollMissionStatus", changeDollMissionStatus);
    } catch (error) {
      console.log(error);
      //socket.emit("toastNotification", { notificationType: 'error', description: error })
      socket.emit("toastNotification", error)


    }
  });

  //CHANGE RESET DOLL MISSION
  socket.on("resetDollMission", async () => {
    try {
      await dollService.deleteDollAndDollPieces()
      //console.log(`events ${changeDollMissionStatus}`)
      io.emit("resetDollMission", null);
    } catch (error) {
      console.log(error);
      //socket.emit("toastNotification", { notificationType: 'error', description: error })
      socket.emit("toastNotification", error)

    }
  });

  //CHANGE DOLL PIECES
  socket.on("changeDollPiece", async (data) => {
    try {
      const changeDollPiece = await dollService.updateDollPiece(data)
      //console.log(`events doll pieces ${changeDollPiece}`)
      io.emit("changeDollPiece", changeDollPiece);
    } catch (error) {
      console.log(error);
     // socket.emit("toastNotification", { notificationType: 'error', description: error })
     socket.emit("toastNotification", error)


    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
};

//CRON  para bajar resistencia y concentracion cada hora
cron.schedule('*/30 * * * *', async () => {
  try {
    await userService.updateAcolitResistanceAndConcentration()
    const modifyAllAcolit = await userService.getAllActiveUsers()
    console.log("*************************************************")
    io.emit('changeAllAcolitAttributes', modifyAllAcolit)
   // console.log(modifyAllAcolit)

  } catch (error) {
    console.log(error);
    //socket.emit("toastNotification", { notificationType: 'error', description: error })
    socket.emit("toastNotification", error)

  }

});

exports.socketEvents = events;