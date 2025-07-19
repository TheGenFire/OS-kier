PROJECT OVERVIEW

This project is a browser-based CPU Scheduling Simulator that supports multiple scheduling algorithms including:

FCFS (First-Come, First-Served)
SJF (Shortest Job First)
SRTF (Shortest Remaining Time First)
Round Robin
Multilevel Feedback Queue (MLFQ)

It allows users to add custom processes with arrival and burst times, configure time quantum and allotments (for RR and MLFQ), and visualize execution using an animated Gantt chart. The interface also displays individual and average process performance metrics.


HOW TO RUN THE SIMULATION
1. Download or clone the repository.
2. Open index.html in any modern web browser (e.g. Chrome, Firefox).
3. Use the input fields to:
4. Add processes
5. Choose scheduling algorithm
6. Configure time quantum or MLFQ levels (if applicable)
7. Click "Run Simulation" to visualize the scheduling.

No server or installation needed. Works entirely in the browser.




SCHEDULING ALGORITHMS IMPLEMENTED

FCFS (First-Come, First-Served)
  - Non-preemptive.
  - Executes processes in order of arrival.

SJF (Shortest Job First)
  - Non-preemptive.
  - Selects the job with the shortest burst time among ready processes.

SRTF (Shortest Remaining Time First)
  - Preemptive version of SJF.
  - If a shorter job arrives, it preempts the currently running process.

Round Robin
  - Preemptive.
  - Processes are given a fixed time slice (quantum).
  - After that, they are moved to the back of the queue if not finished.

MLFQ (Multilevel Feedback Queue)
  - Preemptive and priority-based.
  - Uses multiple queues with different time quantums.
  - Jobs move to lower priority queues if they consume their quantum.
