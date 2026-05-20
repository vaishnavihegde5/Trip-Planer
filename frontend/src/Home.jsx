import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Compass, Calendar, ArrowRight } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', maxWidth: '800px', padding: '4rem 2rem' }}
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '2rem' }}>
            <Map size={48} color="#ea580c" />
            <Compass size={48} color="#ea580c" />
            <Calendar size={48} color="#ea580c" />
          </div>
          
          <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
            Smart Trip Planner
          </h1>
          
          <p className="subtitle" style={{ fontSize: '1.3rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', opacity: 0.8 }}>
            Discover, plan, and organize your next adventure effortlessly with our intelligent AI-driven travel companion.
          </p>

          <button 
            className="btn" 
            style={{ fontSize: '1.2rem', padding: '16px 40px', borderRadius: '50px' }}
            onClick={() => navigate('/login')}
          >
            Get Started <ArrowRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
