//hemangadesara@gmail.com
//username of github - hemangadesara
//pwd - hemang@9292

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

function PriceCard({ title, standard, mini, diff, pct }) {
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div>
          <div style={{fontSize:16,fontWeight:700}}>{title}</div>
          <div className="small">Standard vs Mini</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:14,color:'#374151'}}>Standard</div>
          <div style={{fontSize:18,fontWeight:700}}>{standard !== null ? standard.toFixed(2) : '--'}</div>
        </div>
      </div>
      <hr style={{margin:'10px 0'}}/>
      <div className="pair">
        <div>
          <div className="small">Mini</div>
          <div style={{fontSize:18,fontWeight:700}}>{mini !== null ? mini.toFixed(2) : '--'}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="small">Diff</div>
          <div className="pct">{diff !== null ? diff.toFixed(2) : '--'}</div>
          <div className="small">{pct !== null ? pct.toFixed(2) + '%' : ''}</div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [current, setCurrent] = useState({standard:null, mini:null, diff:null, pct:null});
  const [nextExp, setNextExp] = useState({standard:null, mini:null, diff:null, pct:null});
  const [status, setStatus] = useState('Connecting...');
  const [info, setInfo] = useState(null);

  useEffect(()=> {
    const s = io(BACKEND, { transports: ['websocket'] });
    s.on('connect', () => setStatus('Connected'));
    s.on('disconnect', () => setStatus('Disconnected'));
    s.on('info', (d) => setInfo(d));
    s.on('smartapi:summary', (payload) => {
      if(payload.expiry === 'current'){
        setCurrent({ standard: payload.standard, mini: payload.mini, diff: payload.diff, pct: payload.pct });
      } else if(payload.expiry === 'next'){
        setNextExp({ standard: payload.standard, mini: payload.mini, diff: payload.diff, pct: payload.pct });
      }
    });
    s.on('connect_error', (err) => {
      console.error('socket connect_error', err);
      setStatus('Connect error');
    });
    return ()=> s.disconnect();
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h2>Silver — Standard vs Mini (Live)</h2>
        <div className="small">Status: {status}</div>
      </div>

      <div className="grid">
        <PriceCard title="Current Expiry" {...current} />
        <PriceCard title="Next Expiry" {...nextExp} />
      </div>

      <div className="footer">
      
      </div>
    </div>
  );
}
