import React, { useState } from "react";
import { 
  Cpu, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  Activity, 
  TrendingUp, 
  GraduationCap, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface AIEligibilityProps {
  student: any;
  courses: any[];
  onPredict: (data: any) => Promise<any>;
}

export default function AIEligibility({ student, courses, onPredict }: AIEligibilityProps) {
  const [sscMarks, setSscMarks] = useState(student?.sscMarks || 94.5);
  const [interMarks, setInterMarks] = useState(student?.interMarks || 91.2);
  const [entranceScore, setEntranceScore] = useState(student?.entranceScore || 185);
  const [selectedCourse, setSelectedCourse] = useState(student?.selectedCourse || courses[0]?.name || "B.Tech in Artificial Intelligence & Data Science");
  const [category, setCategory] = useState(student?.category || "General");
  const [reservation, setReservation] = useState(student?.reservation || "None");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await onPredict({
        sscMarks,
        interMarks,
        entranceScore,
        selectedCourse,
        category,
        reservation
      });
      if (data && data.success) {
        setPrediction(data.prediction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (status: string) => {
    switch (status) {
      case "Eligible": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Waiting List": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default: return "text-red-500 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Admission Eligibility</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400">Evaluate historical criteria against your active profile with our deep neural forecasting models.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column (5 cols): Parameter Input Form */}
        <form onSubmit={handleCalculate} className="lg:col-span-5 bg-white border border-gray-100 p-6 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b border-gray-100 pb-3 dark:border-slate-800">
            <Cpu className="h-5 w-5 animate-spin-none" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Predictor Parameters</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Preferred Course */}
            <div className="space-y-1">
              <label className="block font-semibold text-gray-600 dark:text-slate-400">Target Academic Program</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Entrance Score & Marks */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Entrance Score (0-200)</label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={entranceScore}
                  onChange={(e) => setEntranceScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Inter GPA / Marks %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={interMarks}
                  onChange={(e) => setInterMarks(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* SSC Marks & Socio-Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">SSC Marks %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={sscMarks}
                  onChange={(e) => setSscMarks(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Socio-Economic Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="General">General (Unreserved)</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">Economically Weaker Section</option>
                </select>
              </div>
            </div>

            {/* Reservations dropdown */}
            <div className="space-y-1">
              <label className="block font-semibold text-gray-600 dark:text-slate-400">Special Reservation Categories</label>
              <select
                value={reservation}
                onChange={(e) => setReservation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="None">None (General Pool)</option>
                <option value="Sports">Sports Merit (National/State representation)</option>
                <option value="NCC">NCC Cadet / Defense ward</option>
                <option value="PwD">Persons with Disabilities (PwD)</option>
              </select>
            </div>

            <button
              id="recalculate-predict-btn"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Historical Matrices...</span>
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  <span>Forecast Admissions Fit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column (7 cols): AI Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!prediction ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] bg-slate-50/50 dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4">
              <div className="p-4 bg-indigo-50 rounded-full dark:bg-indigo-950/20">
                <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Awaiting Admissions Audit</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Adjust your high school grades or entrance test ranks and click 'Forecast Admissions Fit' to run automatic predictions.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
              
              {/* Output Probability Ring Gauge */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-50 pb-4 dark:border-slate-800/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Prediction Outcome</span>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold border rounded-full ${getPredictionColor(prediction.status)}`}>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{prediction.status}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">Predicted Success Index</h2>
                </div>

                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-1000" strokeWidth="8" fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * prediction.probability) / 100}
                    />
                  </svg>
                  <span className="absolute text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">{prediction.probability}%</span>
                </div>
              </div>

              {/* AI Reasoning Text */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">AI Neural Reasoning</h4>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                  {prediction.aiReasoning}
                </p>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Steps List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">Admissions Steps Checklist</h4>
                  <ul className="space-y-2 text-xs">
                    {prediction.recommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-slate-300 leading-normal">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Alternative Universities suggestions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">Alternative Matches</h4>
                  <div className="space-y-2">
                    {prediction.suggestedColleges?.map((col: string, i: number) => (
                      <div key={i} className="flex items-center space-x-2 p-2 bg-indigo-50/50 dark:bg-slate-950/40 border border-indigo-100/40 dark:border-slate-800 rounded-xl">
                        <GraduationCap className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-slate-300 font-semibold">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
