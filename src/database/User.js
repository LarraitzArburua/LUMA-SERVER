const User = require("../models/userModel");


const loginUser = async (newUser) => {
  try {
    const user = await User.findOne({ email: newUser.email });
    if (!user) {
      //insert new admin user
      
      if (JSON.parse(process.env.LUMA_ADMIN).includes(newUser.email) || JSON.parse(process.env.JOSHUA).includes(newUser.email)) {
        let userToInsert = new User({ ...newUser, isJoshua: true, isInside: null, health: 999999, money: 999999 });
        const createdUser = await userToInsert.save();
        return createdUser;
      } else {
        //insert normal user
        console.log("hola");
        let userToInsert = new User(newUser);

        const createdUser = await userToInsert.save();
        return createdUser;
      }
  
    }
    if (!user.isActive) {
      //update user to active
      const updatedUser = await User.findOneAndUpdate(
        { idToken: idToken },
        { isActive: true }
      );
      return updatedUser;
    }
    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const getAllActiveUsers = async () => {
  try {
    const allUsers = await User.find();
    return allUsers;
  } 
  catch (error) {
    console.log(error)
    throw error;
    
  }
}

const changeCryptValue = async (acolitoEmail) => {
  try {   
    const updateUser = await User.findOne({ email: acolitoEmail.email });
    const filter = { email: updateUser.email};
    const update ={isInside : updateUser.isInside};
    if(!update.isInside){
      update.isInside = true
    }
    else{
      update.isInside = false;
    }
    const isInTheCrypt = await User.findOneAndUpdate(filter, update,
      { new:true}
    )
  return isInTheCrypt;
  } 
  catch (error) {
    throw error
  }
}

module.exports = {
  loginUser,
  getAllActiveUsers,
  changeCryptValue
};
