const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'PLease provide a valid email address']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['admin', 'guide', 'lead-guide', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(val) {
        return val === this.password
      },
      message: 'Password and passwordConfirm are not the same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  emailConfirm: String,
  emailConfirmExpired: Date,
  isConfirmEmail: {
    type: Boolean,
    default: false
  }
})

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined

  next()
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return changedTimestamp > JWTTimestamp
  }
  return false
}

userSchema.methods.createCryptoToken = function(type) {
  const token = crypto.randomBytes(32).toString('hex')
  if (type === 'reset') {
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    this.passwordResetExpired = Date.now() + 10 * 60 * 1000
  }
  this.emailConfirm = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  this.emailConfirmExpired = Date.now() + 30 * 24 * 60 * 60 * 1000
  return token
}

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
