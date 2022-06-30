import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email!'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password!'],
    },
    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/luco22/image/upload/v1656489890/avatar/adkvg8srzntrfqpiynsu.jpg',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Users', User);
