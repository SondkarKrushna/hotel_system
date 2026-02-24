import mongoose from 'mongoose';
const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    min: 1,
    required: true              // how many tablets/strips/bottles to dispense
  },
  dosage: {
    type: String,
    required: true              // e.g. "1", "2", "5 ml", "2 puffs"
  },
  dosageUnit: {                 // optional – helps frontend/apps parse better
    type: String,
    enum: ['tablet', 'capsule', 'ml', 'mg', 'puff', 'drop', 'unit', 'patch', 'other', null],
    default: null
  },
  frequency: {
    type: String,
    required: true              // "once daily", "twice daily", "every 8 hours", "SOS", etc.
  },
  durationDays: {               // renamed → clearer that it's numeric days
    type: Number,
    min: 1,
    required: false
  },
  // route: {
  //   type: String,
  //   default: 'oral',
  //   enum: ['oral', 'IV', 'IM', 'SC', 'topical', 'inhalation', 'rectal', 'vaginal', 'other']
  // },
  timing: {                     // ← before/after meal + other common timing
    type: String,
    enum: ['before food', 'after food', 'with food', 'empty stomach', 'anytime', null],
    default: null
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: 500
  }
});

const prescriptionSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  // Clinical information
  complaints:          { type: String, trim: true },
  examinationFindings: { type: String, trim: true },
  diagnosis:           [{ type: String, trim: true }],
  
  vitals: {
    bp:    { type: String },    // "120/80"
    pulse: { type: String },    // "78/min"
    temp:  { type: String },    // "98.6 F" or "37 C"
    spo2:  { type: String },
    weight:{ type: String },    // "68 kg"
    height:{ type: String, default: null }, // optional bonus field
  },

  medicines: [medicineSchema],

  // New fields matching your list
  recommendedTests: [{
    type: String,
    trim: true
  }],                         // e.g. ["CBC", "LFT", "RBS", "Thyroid profile"]

  advice: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  followUp: {
    date: {
      type: Date,
      required: false
    },
    note: {
      type: String,
      trim: true
    }
  },

  // Administrative / billing fields
  prescriptionNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded", "waived"],
    default: "pending",
    index: true
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Compound unique index → prevent duplicate prescriptions per appointment/hospital
prescriptionSchema.index(
  { appointmentId: 1, hospital: 1 },
  { unique: true, name: 'unique_appointment_hospital' }
);

// Auto-update updatedAt
prescriptionSchema.pre('save', function () {
  this.updatedAt = new Date();
});

export default mongoose.model('Prescription', prescriptionSchema);