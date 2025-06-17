const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true,
    },
    address: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    zipcode: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: Number,
      default: 1, // 0: Inactive, 1: Active
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    schoolId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'School',
      required: true,
    },
    twoFactorSecret: {
      type: String,
      private: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

adminSchema.statics.isEmailTaken = async function (email, excludeAdminId) {
  const admin = await this.findOne({ email, isDeleted: false, _id: { $ne: excludeAdminId } });
  return !!admin;
};

adminSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password.toString(), this.password);
};

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const AdminModel = mongoose.model('Admin', adminSchema);

async function init() {
  const count = await AdminModel.countDocuments({ email: 'superadmin@schoolerp.com' });
  if (count === 0) {
    await AdminModel.create({
      name: 'Super Admin',
      email: 'superadmin@schoolerp.com',
      password: 'SuperAdmin123!',
      role: 'superadmin',
      schoolId: new mongoose.Types.ObjectId(), // Default school for superadmin
    });
  }
}

init();

module.exports = AdminModel;