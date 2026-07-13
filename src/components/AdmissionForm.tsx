import React, { useState } from "react";
import { 
  User, 
  MapPin, 
  BookOpen, 
  Layers, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Sparkles,
  Award
} from "lucide-react";

interface AdmissionFormProps {
  courses: any[];
  onFormSubmit: (formData: any) => Promise<any>;
}

export default function AdmissionForm({ courses, onFormSubmit }: AdmissionFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [dob, setDob] = useState("2008-04-12");
  const [gender, setGender] = useState("Non-Binary");
  const [category, setCategory] = useState("General");
  const [reservation, setReservation] = useState("None");

  const [sscMarks, setSscMarks] = useState(94.5);
  const [sscBoard, setSscBoard] = useState("CBSE");
  const [interMarks, setInterMarks] = useState(91.2);
  const [interBoard, setInterBoard] = useState("State Board");
  const [entranceName, setEntranceName] = useState("Aegis Joint Entrance");
  const [entranceScore, setEntranceScore] = useState(185);

  const [street, setStreet] = useState("142 Skyview Terrace");
  const [city, setCity] = useState("San Francisco");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("94114");

  const [selectedCourse, setSelectedCourse] = useState("B.Tech in Artificial Intelligence & Data Science");

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (isDraft: boolean) => {
    setLoading(true);
    try {
      const profile = {
        fullName,
        email,
        phone,
        address: `${street}, ${city}, ${state} ${zipCode}`,
        gender,
        category,
        reservation,
        sscMarks,
        interMarks,
        entranceScore,
        selectedCourse,
        sscBoard,
        interBoard,
        dob
      };
      await onFormSubmit({ profile, isDraft });
      if (!isDraft) {
        setStep(1); // Reset
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 max-w-4xl mx-auto">
      
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Academic Admission Application</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">Complete all enrollment details. Our AI will automatically evaluate cutoffs upon file submission.</p>
        </div>

        {/* Step Progression Bar */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div 
              key={s}
              className={`h-2.5 w-8 rounded-full transition-colors ${step >= s ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-100 dark:bg-slate-800'}`}
            />
          ))}
          <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 ml-1">Step {step} of {totalSteps}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b border-gray-50 pb-3 dark:border-slate-800/50">
              <User className="h-5 w-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Personal Demographics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Phone Connection</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Gender Identity</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Socio Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b border-gray-50 pb-3 dark:border-slate-800/50">
              <BookOpen className="h-5 w-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Academic Records</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">SSC (10th) Board / School</label>
                <input
                  type="text"
                  value={sscBoard}
                  onChange={(e) => setSscBoard(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">SSC Marks / GPA %</label>
                <input
                  type="number"
                  step="0.1"
                  value={sscMarks}
                  onChange={(e) => setSscMarks(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Intermediate (12th) Board</label>
                <input
                  type="text"
                  value={interBoard}
                  onChange={(e) => setInterBoard(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Intermediate Marks %</label>
                <input
                  type="number"
                  step="0.1"
                  value={interMarks}
                  onChange={(e) => setInterMarks(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Entrance Test Exam Name</label>
                <input
                  type="text"
                  value={entranceName}
                  onChange={(e) => setEntranceName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Entrance Score / Rank (out of 200)</label>
                <input
                  type="number"
                  value={entranceScore}
                  onChange={(e) => setEntranceScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Address Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b border-gray-50 pb-3 dark:border-slate-800/50">
              <MapPin className="h-5 w-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Mailing Address</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Street Name / Apt</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-600 dark:text-slate-400">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-gray-600 dark:text-slate-400">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Course Selection & Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b border-gray-50 pb-3 dark:border-slate-800/50">
              <Layers className="h-5 w-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Program Course Preference</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Select Core Subject Stream</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Declaration checkbox statement */}
              <div className="p-4 rounded-2xl border border-gray-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Legal Declaration Commitment</h4>
                <p>I hereby declare that all academic board grades and reservation credentials stated herein are truthful. I consent to automatic AI verification audits matching board logs.</p>
              </div>
            </div>
          </div>
        )}

        {/* Button Controls Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6 dark:border-slate-800">
          <button
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-xl text-xs font-bold transition-all text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-2 text-indigo-600 border border-indigo-100 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all dark:border-slate-800 dark:text-indigo-400"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                id="submit-admission-form-btn"
                className="flex items-center space-x-1.5 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Submit to Registrar</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
