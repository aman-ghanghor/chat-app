import UserModel from "../models/User.js";
import path from "path";

class UserController {
  // Create User
  static createDoc = async (req, res) => {
    try {
      console.log(req.file);
      const avatar = req.file.filename;
      const { firstname, lastname, username, email, password } = req.body;
      const alreadyExists = await UserModel.exists({ email });
      if (!alreadyExists) {
        const user = { firstname, lastname, username, email, password, avatar };
        const userDoc = new UserModel(user);
        const result = await userDoc.save();
        res.send(result);
      } else {
        res.send("ALREADY_EXISTS");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Get All Contacts
  static getContacts = async (req, res) => {
    const { user_id } = req.query;
    try {
      const { contacts } = await UserModel.findOne({ _id: user_id });
      const contactsList = await Promise.all(
        contacts.map(async (contact) => {
          try {
            const contactInfo = await UserModel.findOne(
              { username: contact.username },
              { _id: 1, username: 1, firstname: 1, lastname: 1, avatar: 1, about: 1 }
            );
            return contactInfo;
          } catch (err) {
            console.log(err);
          }
        })
      );
      res.send(contactsList);
    } catch (err) {
      console.log(err);
    }
  };
  // Login the user
  static loginUser = async (req, res) => {
    try {
      const { email, password } = req.query;
      const user = await UserModel.findOne({ email, password });
      if (user) {
        res.send(user);
      } else {
        res.send("INCORRECT");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Get Image file
  static getFile = async (req, res) => {
    const avatarId = req.query.avatar;
    const avatarPath = path.join(process.cwd(), `uploads/avatar/${avatarId}`);
    res.sendFile(avatarPath);
  };
  // Get Matches
  static getMatches = async (req, res) => {
    const { search } = req.query;
    const str = `${search}`;
    const match = new RegExp(str, "g");
    try {
      const result = await UserModel.find(
        { username: { $regex: match } },
        { username: 1, avatar: 1 }
      ).sort({ username: 1 });
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  };
  // Add Contacts
  static addContacts = async (req, res) => {
    const { me_id } = req.query;
    const users = req.body;
    const usersArr = users.map((user)=> ({username: user}))
    console.log(usersArr)
    try {
      const filter = {_id: me_id, "contacts.username": {$nin: users} }
      const update = {$push: {"contacts": {$each: usersArr}}}
      const result = await UserModel.updateOne(filter, update)
      if(result.acknowledged) {
        res.send("ADDED") ;
      }
    } catch (err) {
      console.log(err);                                                                         
    }
  }

  
  // Get Contact By username
  static getContactsByUsername = async (req, res) => {
    const {username} = req.query ; 
    try {
      const paths = { _id: 1, username: 1, firstname: 1, lastname: 1, avatar: 1, about: 1 }
      const contact = await UserModel.findOne({username: username}, paths) 
      console.log(contact)
      if(contact) {
        res.send(contact)
      }
    } catch(err) {
      console.log(err)
    }
  }

  // ---------- DEMO -----------
  static getDemo = async (req, res) => {
    try {
      const filter = { username: "@pawanSharma" };
      const update1 = { $set: { "contacts.$.blocked": true } };
      const update2 = {
        $push: { contacts: { contactId: "12345", username: "@ram" } },
      };
      const data = await UserModel.findOneAndUpdate(filter, update2);
      console.log(data);
      res.send(data);
    } catch (err) {
      console.log(err);
    }
  };
}

export default UserController;
