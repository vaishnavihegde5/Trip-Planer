import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Wallet, Heart, Car, LogOut, Building, Utensils, TreePine, ShoppingBag, Palette, Moon, Mountain, Camera } from 'lucide-react';

const INDIAN_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Goa', 'Kerala', 'Agra', 'Udaipur'];
const INTERESTS_DATA = [
  { name: 'Heritage', icon: '🏛️' },
  { name: 'Street Food', icon: '🌮' },
  { name: 'Museums', icon: '🖼️' },
  { name: 'Nature', icon: '🌲' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Art', icon: '🎨' },
  { name: 'Nightlife', icon: '🌃' },
  { name: 'Adventure', icon: '⛰️' },
];
const TRANSPORT_OPTIONS = ['Walking', 'Public Transit', 'Taxi/Rideshare', 'Rental Car'];

function Wizard() {
  const [availableInterests, setAvailableInterests] = useState(INTERESTS_DATA);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    city: '',
    area: '',
    timings: { start: '09:00', end: '20:00' },
    budget: '',
    interests: [],
    customInterest: '',
    vibe: '',
    transport: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    navigate('/itinerary', { state: { formData } });
  };

  const handleKeyDown = (e, isValid) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      if (step === steps.length - 1) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 5 ? [...prev.interests, interest] : prev.interests;
      return { ...prev, interests };
    });
  };

  const steps = [
    {
      id: 'city',
      title: "Where are we going?",
      icon: <MapPin size={40} color="#ff8e53" />,
      content: (
        <div className="wizard-step">
          <div className="interest-tags" style={{ justifyContent: 'center' }}>
            {INDIAN_CITIES.map(c => (
              <div 
                key={c} 
                className={`interest-tag ${formData.city === c ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, city: c})}
              >
                {c}
              </div>
            ))}
          </div>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Or type another Indian city..." 
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
            style={{ marginBottom: '10px' }}
          />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Specific area or neighborhood (optional)..." 
            value={formData.area}
            onChange={e => setFormData({...formData, area: e.target.value})}
            onKeyDown={e => handleKeyDown(e, Boolean(formData.city))}
          />
          <button className="btn" onClick={handleNext} disabled={!formData.city}>Next</button>
        </div>
      )
    },
    {
      id: 'timings',
      title: "What are your timings?",
      icon: <Clock size={40} color="#ff8e53" />,
      content: (
        <div className="wizard-step">
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.9rem', opacity: 0.8 }}>Start Time</label>
              <input 
                type="time" 
                className="input-field" 
                value={formData.timings.start}
                onChange={e => setFormData({...formData, timings: {...formData.timings, start: e.target.value}})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.9rem', opacity: 0.8 }}>End Time</label>
              <input 
                type="time" 
                className="input-field" 
                value={formData.timings.end}
                onChange={e => setFormData({...formData, timings: {...formData.timings, end: e.target.value}})}
                onKeyDown={e => handleKeyDown(e, true)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn" onClick={handleNext}>Next</button>
          </div>
        </div>
      )
    },
    {
      id: 'budget',
      title: "What's your budget? (₹)",
      icon: <Wallet size={40} color="#ff8e53" />,
      content: (
        <div className="wizard-step">
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: '800', color: '#ea580c' }}>
            ₹{formData.budget || 100}
          </div>
          <input 
            type="range" 
            min="100" max="100000" step="100"
            style={{ width: '100%', marginBottom: '1rem', cursor: 'pointer' }}
            value={formData.budget || 100}
            onChange={e => setFormData({...formData, budget: e.target.value})}
            onKeyDown={e => handleKeyDown(e, true)}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '2rem' }}>
            <button className="alt-btn" onClick={() => setFormData({...formData, budget: 1000})}>₹1000</button>
            <button className="alt-btn" onClick={() => setFormData({...formData, budget: 2500})}>₹2500</button>
            <button className="alt-btn" onClick={() => setFormData({...formData, budget: 5000})}>₹5000</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn" onClick={handleNext} disabled={!formData.budget && formData.budget !== 0}>Next</button>
          </div>
        </div>
      )
    },
    {
      id: 'interests',
      title: "Select up to 5 interests",
      icon: <Heart size={40} color="#ff8e53" />,
      content: (
        <div className="wizard-step">
          <div className="interest-tags">
            {availableInterests.map(item => (
              <div 
                key={item.name} 
                className={`interest-tag ${formData.interests.includes(item.name) ? 'selected' : ''}`}
                onClick={() => toggleInterest(item.name)}
                style={!item.icon ? { padding: '8px 12px', minWidth: 'auto', flex: '0 1 auto', fontSize: '0.9rem' } : {}}
              >
                {item.icon && <span style={{ fontSize: '24px' }}>{item.icon}</span>}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Add custom interest..." 
              value={formData.customInterest}
              onChange={e => setFormData({...formData, customInterest: e.target.value})}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (formData.customInterest && formData.interests.length < 5) {
                    setFormData(prev => {
                      const newInterests = prev.interests.includes(prev.customInterest) 
                        ? prev.interests 
                        : [...prev.interests, prev.customInterest];
                      return { ...prev, interests: newInterests, customInterest: '' };
                    });
                    if (!availableInterests.find(i => i.name.toLowerCase() === formData.customInterest.toLowerCase())) {
                      setAvailableInterests(prev => [...prev, { name: formData.customInterest, icon: '' }]);
                    }
                  } else if (formData.interests.length > 0) {
                     handleNext();
                  }
                }
              }}
              style={{ marginBottom: 0 }}
            />
            <button 
              className="btn" 
              style={{ marginTop: 0, padding: '15px', borderRadius: '10px', width: 'auto' }}
              onClick={() => {
                if (formData.customInterest && formData.interests.length < 5) {
                  setFormData(prev => {
                    const newInterests = prev.interests.includes(prev.customInterest) 
                      ? prev.interests 
                      : [...prev.interests, prev.customInterest];
                    return { ...prev, interests: newInterests, customInterest: '' };
                  });
                  if (!availableInterests.find(i => i.name.toLowerCase() === formData.customInterest.toLowerCase())) {
                    setAvailableInterests(prev => [...prev, { name: formData.customInterest, icon: '' }]);
                  }
                }
              }}
            >
              Add
            </button>
          </div>
          <p style={{ margin: '10px 0', fontSize: '0.9rem', opacity: 0.8 }}>
            Selected: {formData.interests.length}/5
          </p>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn" onClick={handleNext} disabled={formData.interests.length === 0}>Next</button>
          </div>
        </div>
      )
    },
    {
      id: 'vibe',
      title: "What's your travel vibe?",
      icon: <Palette size={40} color="#ff8e53" />,
      content: (
        <div className="wizard-step">
          <div className="interest-tags" style={{ justifyContent: 'center' }}>
            {['Relaxed', 'Adventure', 'Cultural'].map(option => (
              <div 
                key={option} 
                className={`interest-tag ${formData.vibe === option.toLowerCase() ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, vibe: option.toLowerCase()})}
              >
                {option}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn" onClick={handleNext} disabled={!formData.vibe}>Next</button>
          </div>
        </div>
      )
    },
    {
      id: 'transport',
      title: "How are you getting around?",
      icon: <Car size={40} color="#ff8e53" />,
      content: (
        <div className="wizard-step">
          <div className="interest-tags" style={{ justifyContent: 'center' }}>
            {TRANSPORT_OPTIONS.map(option => (
              <div 
                key={option} 
                className={`interest-tag ${formData.transport === option ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, transport: option})}
              >
                {option}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn" onClick={handleSubmit} disabled={!formData.transport}>Plan My Trip!</button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', gap: '10px' }}>
        <button className="btn btn-secondary" style={{ marginTop: 0, padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => navigate('/dashboard')}>My Trips</button>
        <button className="btn btn-secondary" style={{ marginTop: 0, padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          {steps[step].icon}
        </div>
        <h1 className="title">{steps[step].title}</h1>
        <p className="subtitle">Step {step + 1} of {steps.length}</p>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Wizard;
