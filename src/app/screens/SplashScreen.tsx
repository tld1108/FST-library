import { useEffect } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <BookOpen className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">FST Library</h1>
        <p className="text-white/90 text-sm mb-8">Faculty of Science and Technology</p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Loader2 className="w-8 h-8 text-white mx-auto animate-spin" />
        </motion.div>
      </motion.div>
    </div>
  );
}
