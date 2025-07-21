let processes = [];
let pid = 1;

// Render process table in the UI
function renderProcesses() {
  const tbody = document.getElementById('process-list');
  tbody.innerHTML = '';
  processes.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>P${p.id}</td>
      <td>${p.arrivalTime}</td>
      <td>${p.burstTime}</td>
      <td><button type="button" onclick="removeProcess(${i})" class="remove-btn">Remove</button></td>`;
    tbody.appendChild(tr);
  });
}

// Remove a process
window.removeProcess = function(i) {
  processes.splice(i, 1);
  renderProcesses();
};

// Add process manually
document.getElementById('add-process').onclick = function() {
  const arrivalInput = document.getElementById('arrival');
  const burstInput = document.getElementById('burst');
  const arrival = Number(arrivalInput.value);
  const burst = Number(burstInput.value);

  if (Number.isNaN(arrival) || arrival < 0) {
    showMessage('Arrival time must be 0 or greater.');
    return;
  }
  if (Number.isNaN(burst) || burst < 1) {
    showMessage('Burst time must be 1 or greater.');
    return;
  }

  processes.push({ id: pid++, arrivalTime: arrival, burstTime: burst });
  renderProcesses();
  showMessage('Process added!', 'success');
  arrivalInput.value = '';
  burstInput.value = '';
};

// Generate random processes
document.getElementById('random-processes').onclick = function() {
  processes = [];
  pid = 1;
  const n = 5 + Math.floor(Math.random() * 5);
  for (let i = 0; i < n; i++) {
    processes.push({
      id: pid++,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: 1 + Math.floor(Math.random() * 10)
    });
  }
  renderProcesses();
  showMessage('Random processes generated!', 'success');
};

// Show/hide RR/MLFQ params
document.getElementById('algorithm').onchange = function() {
  document.getElementById('rr-params').style.display = this.value === 'rr' ? '' : 'none';
  document.getElementById('mlfq-params').style.display = this.value === 'mlfq' ? '' : 'none';
};

// Main scheduling and display logic
document.getElementById('scheduler-form').onsubmit = function(e) {
  e.preventDefault();
  if (processes.length === 0) {
    showMessage('No processes to schedule!');
    return;
  }
  document.getElementById('results').style.display = '';

  // Deep copy for simulation
  let procs = processes.map(p => ({
    id: p.id,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    remaining: p.burstTime,
    completion: 0,
    turnaround: 0,
    response: -1,
    queue: 0,
    timeUsed: 0
  }));

  let gantt = [];
  let algo = document.getElementById('algorithm').value;
  let rrQuantum = Number(document.getElementById('rr-quantum').value) || 2;
  let mlfqQuanta = (document.getElementById('mlfq-quanta').value || "2,4,8,16").split(',').map(Number);
  let mlfqAllot = (document.getElementById('mlfq-allot').value || "4,8,16,32").split(',').map(Number);

  if (algo === 'fcfs') simulateFCFS(procs, gantt);
  else if (algo === 'sjf') simulateSJF(procs, gantt);
  else if (algo === 'srtf') simulateSRTF(procs, gantt);
  else if (algo === 'rr') simulateRR(procs, gantt, rrQuantum);
  else if (algo === 'mlfq') simulateMLFQ(procs, gantt, mlfqQuanta, mlfqAllot);

  // Render Gantt Chart with animation
  const colors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#00bcd4', '#f44336', '#8bc34a', '#ffc107', '#3f51b5'];
  const queueColors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63'];
  const ganttDiv = document.getElementById('gantt');
  ganttDiv.innerHTML = '';
  const chartWrapper = document.createElement('div');
  chartWrapper.style.display = 'flex';
  chartWrapper.style.alignItems = 'flex-start';
  chartWrapper.style.flexDirection = 'row';
  chartWrapper.style.position = 'relative';
  // Helper to create a column (block + tick)
  function createCol(block, tick) {
    const col = document.createElement('div');
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.alignItems = 'flex-end';
    col.appendChild(block);
    col.appendChild(tick);
    return col;
  }
  // First tick (start time)
  if (gantt.length > 0) {
    const firstCol = document.createElement('div');
    firstCol.style.display = 'flex';
    firstCol.style.flexDirection = 'column';
    firstCol.style.alignItems = 'flex-start';
    const emptyBlock = document.createElement('div');
    emptyBlock.style.height = '40px';
    emptyBlock.style.width = '0px';
    firstCol.appendChild(emptyBlock);
    const firstTick = document.createElement('div');
    firstTick.textContent = gantt[0].start;
    firstTick.style.fontSize = '13px';
    firstTick.style.color = '#333';
    firstTick.style.fontWeight = 'normal';
    firstTick.style.marginLeft = '0';
    firstTick.style.width = '0px';
    firstTick.style.textAlign = 'left';
    firstCol.appendChild(firstTick);
    chartWrapper.appendChild(firstCol);
  }
  // Animation: add each bar with a delay
  function animateGantt(i) {
    if (i >= gantt.length) return;
    const g = gantt[i];
    const block = document.createElement('div');
    block.className = 'gantt-block';
    block.style.width = `${(g.end - g.start) * 40}px`;
    block.style.height = '40px';
    block.style.background = g.queue !== undefined && g.queue >= 0 ? queueColors[g.queue % 4] : colors[i % colors.length];
    block.innerHTML = `P${g.pid}${g.queue !== undefined && g.queue >= 0 ? `<sub>Q${g.queue}</sub>` : ''}`;
    block.style.opacity = '0';
    block.style.transform = 'scaleX(0.7)';
    // Tick (end time)
    const tick = document.createElement('div');
    tick.textContent = g.end;
    tick.style.fontSize = '13px';
    tick.style.color = '#333';
    tick.style.fontWeight = 'normal';
    tick.style.width = `${(g.end - g.start) * 40}px`;
    tick.style.textAlign = 'right';
    tick.style.opacity = '0';
    // Add to chart
    const col = createCol(block, tick);
    chartWrapper.appendChild(col);
    // Animate in
    setTimeout(() => {
      block.style.transition = 'opacity 0.4s, transform 0.4s';
      block.style.opacity = '1';
      block.style.transform = 'scaleX(1)';
      tick.style.transition = 'opacity 0.4s';
      tick.style.opacity = '1';
    }, 80);
    setTimeout(() => animateGantt(i + 1), 180);
  }
  ganttDiv.appendChild(chartWrapper);
  animateGantt(0);

  // Render Process Table
  let table = `<table><tr>
    <th>PID</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>Turnaround</th><th>Response</th></tr>`;
  procs.forEach(g => {
    table += `<tr>
      <td>P${g.id}</td>
      <td>${g.arrivalTime}</td>
      <td>${g.burstTime}</td>
      <td>${g.completion}</td>
      <td>${g.turnaround}</td>
      <td>${g.response}</td>
    </tr>`;
  });
  table += '</table>';
  document.getElementById('result-table').innerHTML = table;

  // Add Export CSV button if not already present
  let exportBtn = document.getElementById('export-csv-btn');
  if (!exportBtn) {
    exportBtn = document.createElement('button');
    exportBtn.id = 'export-csv-btn';
    exportBtn.textContent = 'Export Results (CSV)';
    exportBtn.style.margin = '12px 0 0 0';
    exportBtn.style.padding = '8px 22px';
    exportBtn.style.border = 'none';
    exportBtn.style.background = 'linear-gradient(90deg, #42a5f5 60%, #66bb6a 100%)';
    exportBtn.style.color = '#fff';
    exportBtn.style.borderRadius = '6px';
    exportBtn.style.cursor = 'pointer';
    exportBtn.style.fontWeight = 'bold';
    exportBtn.style.fontSize = '1em';
    exportBtn.style.boxShadow = '0 2px 8px #2196f344';
    exportBtn.style.transition = 'background 0.2s, box-shadow 0.2s, transform 0.1s';
    exportBtn.onmouseover = function() {
      exportBtn.style.background = 'linear-gradient(90deg, #66bb6a 60%, #42a5f5 100%)';
      exportBtn.style.boxShadow = '0 4px 16px #2196f366';
      exportBtn.style.transform = 'translateY(-2px) scale(1.04)';
    };
    exportBtn.onmouseout = function() {
      exportBtn.style.background = 'linear-gradient(90deg, #42a5f5 60%, #66bb6a 100%)';
      exportBtn.style.boxShadow = '0 2px 8px #2196f344';
      exportBtn.style.transform = 'none';
    };
    document.getElementById('results').insertBefore(exportBtn, document.getElementById('result-table'));
  }

  // Export CSV logic
  exportBtn.onclick = function() {
    let csv = '';
    // Section 1: Given Processes
    csv += 'Given Processes\n';
    csv += 'PID,Arrival,Burst\n';
    processes.forEach(p => {
      csv += `P${p.id},${p.arrivalTime},${p.burstTime}\n`;
    });
    csv += '\n';

    // Section 2: Gantt Chart Details
    csv += 'Gantt Chart Details\n';
    csv += 'PID,Start,End';
    if (gantt.length && gantt[0].queue !== undefined) csv += ',Queue';
    csv += '\n';
    gantt.forEach(g => {
      csv += `P${g.pid},${g.start},${g.end}`;
      if (g.queue !== undefined) csv += `,Q${g.queue}`;
      csv += '\n';
    });
    csv += '\n';

    // Section 3: Results Table
    csv += 'Results Table\n';
    csv += 'PID,Arrival,Burst,Completion,Turnaround,Response\n';
    procs.forEach(g => {
      csv += `P${g.id},${g.arrivalTime},${g.burstTime},${g.completion},${g.turnaround},${g.response}\n`;
    });
    csv += '\n';

    // Section 4: Summary Statistics
    csv += 'Summary Statistics\n';
    const avgTAT = (procs.reduce((a, g) => a + g.turnaround, 0) / procs.length).toFixed(2);
    const avgRT = (procs.reduce((a, g) => a + g.response, 0) / procs.length).toFixed(2);
    csv += `Average Turnaround Time,${avgTAT}\n`;
    csv += `Average Response Time,${avgRT}\n`;

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpu_scheduler_results.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Render Summary Statistics
  const avgTAT = (procs.reduce((a, g) => a + g.turnaround, 0) / procs.length).toFixed(2);
  const avgRT = (procs.reduce((a, g) => a + g.response, 0) / procs.length).toFixed(2);
  document.getElementById('summary').innerHTML =
    `Average Turnaround Time: ${avgTAT}<br>Average Response Time: ${avgRT}`;
};

// Scheduling algorithms
function simulateFCFS(procs, gantt) {
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  for (let p of procs) {
    if (time < p.arrivalTime) time = p.arrivalTime;
    if (p.response === -1) p.response = time - p.arrivalTime;
    gantt.push({ start: time, end: time + p.burstTime, pid: p.id });
    time += p.burstTime;
    p.completion = time;
    p.turnaround = p.completion - p.arrivalTime;
  }
}

function simulateSJF(procs, gantt) {
  let time = 0, done = 0, n = procs.length;
  let finished = Array(n).fill(false);
  while (done < n) {
    let idx = -1, minBurst = Infinity;
    for (let i = 0; i < n; i++) {
      let p = procs[i];
      if (!finished[i] && p.arrivalTime <= time && p.burstTime < minBurst) {
        minBurst = p.burstTime; idx = i;
      }
    }
    if (idx === -1) { time++; continue; }
    let p = procs[idx];
    if (p.response === -1) p.response = time - p.arrivalTime;
    gantt.push({ start: time, end: time + p.burstTime, pid: p.id });
    time += p.burstTime;
    p.completion = time;
    p.turnaround = p.completion - p.arrivalTime;
    finished[idx] = true; done++;
  }
}

function simulateSRTF(procs, gantt) {
  let time = 0, done = 0, n = procs.length;
  let rem = procs.map(p => p.burstTime);
  let started = Array(n).fill(false);
  let lastPid = null;
  let lastBlock = null;
  while (done < n) {
    let idx = -1, minRem = Infinity;
    for (let i = 0; i < n; i++) {
      let p = procs[i];
      if (rem[i] > 0 && p.arrivalTime <= time && rem[i] < minRem) {
        minRem = rem[i]; idx = i;
      }
    }
    if (idx === -1) { time++; continue; }
    if (!started[idx]) {
      procs[idx].response = time - procs[idx].arrivalTime;
      started[idx] = true;
    }
    // Merge consecutive blocks for the same process
    if (lastBlock && lastPid === procs[idx].id) {
      lastBlock.end = time + 1;
    } else {
      lastBlock = { start: time, end: time + 1, pid: procs[idx].id };
      gantt.push(lastBlock);
      lastPid = procs[idx].id;
    }
    rem[idx]--;
    time++;
    if (rem[idx] === 0) {
      procs[idx].completion = time;
      procs[idx].turnaround = procs[idx].completion - procs[idx].arrivalTime;
      done++;
    }
  }
}

function simulateRR(procs, gantt, quantum) {
  let q = [], time = 0, idx = 0, n = procs.length, done = 0;
  let inQ = Array(n).fill(false);
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime);
  while (done < n) {
    while (idx < n && procs[idx].arrivalTime <= time) {
      q.push(idx); inQ[idx] = true; idx++;
    }
    if (q.length === 0) { time++; continue; }
    let i = q.shift();
    let p = procs[i];
    if (p.response === -1) p.response = time - p.arrivalTime;
    let run = Math.min(quantum, p.remaining);
    gantt.push({ start: time, end: time + run, pid: p.id });
    p.remaining -= run;
    time += run;
    while (idx < n && procs[idx].arrivalTime <= time) {
      q.push(idx); inQ[idx] = true; idx++;
    }
    if (p.remaining > 0) q.push(i);
    else {
      p.completion = time;
      p.turnaround = p.completion - p.arrivalTime;
      done++;
    }
  }
}

function simulateMLFQ(procs, gantt, quanta, allot) {
  let queues = [[], [], [], []];
  let time = 0, idx = 0, n = procs.length, done = 0;
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime);
  while (done < n) {
    while (idx < n && procs[idx].arrivalTime <= time) queues[0].push(idx++);
    let qIdx = -1;
    for (let i = 0; i < 4; i++) if (queues[i].length) { qIdx = i; break; }
    if (qIdx === -1) { time++; continue; }
    let i = queues[qIdx].shift();
    let p = procs[i];
    if (p.response === -1) p.response = time - p.arrivalTime;
    let run = Math.min(p.remaining, Math.min(quanta[qIdx], allot[qIdx] - p.timeUsed));
    gantt.push({ start: time, end: time + run, pid: p.id, queue: qIdx });
    p.remaining -= run;
    p.timeUsed += run;
    time += run;
    while (idx < n && procs[idx].arrivalTime <= time) queues[0].push(idx++);
    if (p.remaining > 0) {
      if (p.timeUsed >= allot[qIdx] && qIdx < 3) {
        p.queue = qIdx + 1; p.timeUsed = 0;
        queues[qIdx + 1].push(i);
      } else {
        queues[qIdx].push(i);
      }
    } else {
      p.completion = time;
      p.turnaround = p.completion - p.arrivalTime;
      done++;
    }
  }
}

// Action message helper
function showMessage(msg, type = "error") {
  const msgDiv = document.getElementById('action-message');
  msgDiv.textContent = msg;
  msgDiv.className = 'action-message' + (type === "success" ? " success" : "");
  msgDiv.style.display = 'block';
  setTimeout(() => { msgDiv.style.display = 'none'; }, 3500);
}

// Initial render
renderProcesses();
