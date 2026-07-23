// pages/Analytics.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Star, Clock } from 'lucide-react';
import { getSurveyById } from '../utils/storage';
import { responseService } from '../services/responseService';
import { getSurveyStats } from '../utils/surveyHelpers';

// Simple chart components without external dependencies
const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="mt-2">
      <h6 className="small fw-semibold mb-2">{title}</h6>
      <div>
        {data.map((item, index) => (
          <div key={index} className="d-flex align-items-center gap-2 mb-1">
            <span className="small text-muted" style={{ minWidth: '40px' }}>{item.label}</span>
            <div className="flex-grow-1 bg-light rounded" style={{ height: '20px' }}>
              <div 
                className="bg-primary rounded h-100" 
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  background: '#00084D',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <span className="small fw-semibold" style={{ minWidth: '30px' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analytics = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const surveyData = getSurveyById(surveyId);
    if (!surveyData) {
      navigate('/dashboard');
      return;
    }
    setSurvey(surveyData);
    
    const surveyStats = getSurveyStats(surveyId);
    setStats(surveyStats);
    setLoading(false);
  }, [surveyId, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalResponses === 0) {
    return (
      <div className="container mt-4">
        <button className="btn btn-outline-secondary btn-sm mb-4" onClick={() => navigate(`/responses/${surveyId}`)}>
          <ArrowLeft size={16} className="me-1" /> Back to Responses
        </button>
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <TrendingUp size={48} className="text-muted mb-3" />
          <h5>No analytics data yet</h5>
          <p className="text-muted">Start collecting responses to see analytics</p>
        </div>
      </div>
    );
  }

  // Calculate question-wise statistics
  const questionStats = survey.questions.map(question => {
    const answers = stats.responses
      .flatMap(r => r.answers || [])
      .filter(a => a.questionId === question.id);
    
    const values = answers.map(a => a.answer);
    
    return {
      ...question,
      totalAnswers: answers.length,
      values,
      // For rating questions
      average: question.type === 'rating' 
        ? (values.reduce((sum, v) => sum + (parseInt(v) || 0), 0) / values.length || 0).toFixed(1)
        : null,
      // For choice questions
      distribution: ['radio', 'checkbox', 'dropdown'].includes(question.type)
        ? question.options?.map(opt => ({
            label: opt,
            value: values.filter(v => v === opt || (Array.isArray(v) && v.includes(opt))).length,
          })) || []
        : [],
    };
  });

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => navigate(`/responses/${surveyId}`)}>
            <ArrowLeft size={16} className="me-1" /> Back to Responses
          </button>
          <h4 className="d-inline-block fw-bold m-0" style={{ color: '#00084D' }}>
            <TrendingUp size={24} className="me-2" />
            Analytics - {survey?.title}
          </h4>
        </div>
        <span className="badge bg-primary">{stats.totalResponses} responses</span>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <div className="d-flex align-items-center gap-2">
              <Users size={18} className="text-primary" />
              <p className="text-muted small mb-0">Total Responses</p>
            </div>
            <h3 className="fw-bold m-0" style={{ color: '#00084D' }}>{stats.totalResponses}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <div className="d-flex align-items-center gap-2">
              <Clock size={18} className="text-success" />
              <p className="text-muted small mb-0">Completion Rate</p>
            </div>
            <h3 className="fw-bold text-success m-0">{stats.completionRate}%</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <div className="d-flex align-items-center gap-2">
              <Star size={18} className="text-warning" />
              <p className="text-muted small mb-0">Average Rating</p>
            </div>
            <h3 className="fw-bold text-warning m-0">{stats.averageRating || '-'}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <div className="d-flex align-items-center gap-2">
              <TrendingUp size={18} className="text-info" />
              <p className="text-muted small mb-0">Questions</p>
            </div>
            <h3 className="fw-bold text-info m-0">{survey?.questions?.length || 0}</h3>
          </div>
        </div>
      </div>

      {/* Question-wise Analytics */}
      <div className="row g-3">
        {questionStats.map((qStat, index) => (
          <div key={qStat.id} className="col-12 col-md-6">
            <div className="bg-white p-3 rounded-3 shadow-sm border border-light h-100">
              <h6 className="fw-semibold mb-1">
                {index + 1}. {qStat.title}
              </h6>
              <div className="text-muted small">
                {qStat.totalAnswers} responses
                {qStat.average && (
                  <span className="ms-2">
                    ⭐ Average: {qStat.average}
                  </span>
                )}
              </div>

              {/* Rating Distribution */}
              {qStat.type === 'rating' && qStat.totalAnswers > 0 && (
                <SimpleBarChart 
                  data={[1,2,3,4,5].map(r => ({
                    label: `${r}⭐`,
                    value: qStat.values.filter(v => parseInt(v) === r).length,
                  }))}
                  title="Rating Distribution"
                />
              )}

              {/* Choice Distribution */}
              {['radio', 'dropdown'].includes(qStat.type) && qStat.distribution.length > 0 && (
                <SimpleBarChart 
                  data={qStat.distribution}
                  title="Answer Distribution"
                />
              )}

              {/* Checkbox Distribution */}
              {qStat.type === 'checkbox' && qStat.distribution.length > 0 && (
                <SimpleBarChart 
                  data={qStat.distribution}
                  title="Selection Distribution"
                />
              )}

              {qStat.type === 'text' && qStat.totalAnswers > 0 && (
                <div className="mt-2">
                  <div className="small text-muted">Sample answers:</div>
                  <div className="bg-light rounded p-2 mt-1" style={{ maxHeight: '100px', overflow: 'auto' }}>
                    {qStat.values.slice(0, 5).map((val, i) => (
                      <div key={i} className="small border-bottom py-1">"{val}"</div>
                    ))}
                    {qStat.values.length > 5 && (
                      <div className="small text-muted mt-1">+ {qStat.values.length - 5} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;