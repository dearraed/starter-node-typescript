import '../database';
import { RoleCode, RoleModel } from '../database/model/Role';
import User, { UserModel } from '../database/model/User';
import bcryptjs from 'bcryptjs';
import { seeder } from '../config';
import mongoose from 'mongoose';


let seed = async () => {
  await seedDelete();
  await seedRoles();
  await seedAdmin();
  process.exit(1);
}

let seedRoles = async () => {
  let roles = await RoleModel.find();
  if(roles.length == 0){
    await RoleModel.insertMany([
      { code: RoleCode.ADMIN, status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: RoleCode.USER, status: true, createdAt: new Date(), updatedAt: new Date() }
    ]);
   console.log("Roles inserted successfully");
   
  }else{
    console.log("Roles already exists !")
  }
}

let seedAdmin = async () => {
  let roleAdmin = await RoleModel.findOne({code : RoleCode.ADMIN });
  
  if(roleAdmin){
    let admins = await UserModel.find({roles: roleAdmin._id});
      
    if(admins.length > 0){
       console.log("Admin user exist");
    }else{
      try{
        let password = await bcryptjs.hash(seeder.adminPass, 12);
        let admin = { roles: [ roleAdmin ], verified : true, status : true, name : seeder.adminName, email : seeder.adminEmail, password : password, createdAt: new Date(), updatedAt: new Date()  };
              
        await UserModel.create(admin as User);
        
        console.log("Admin user added sucessfuly !");
      }catch(error){
        console.log("error : ", error);
      }
 }
   
   
  }else{
    console.log("Role admin inexistant !")
  }
}

let seedDelete = async () => {
//     let collections = mongoose.models;
//     console.log(collections);
//     let keys = Object.keys(collections);
//     keys.forEach(async element => {
//         await collections[element].deleteMany({}).exec(); 
//  });  

const collections = mongoose.modelNames();
const deletedCollections = collections.map((collection) =>
 mongoose.models[collection].deleteMany({})
);
  await Promise.all(deletedCollections);
  console.log("Collections empty successfuly !");
  
}

seed();
