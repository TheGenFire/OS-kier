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
    

SCREENSHOTS FOR DIFFERENT ALGORITHMS OUTPUT:

<img width="958" height="910" alt="image" src="https://github.com/user-attachments/assets/40c805e0-30fd-49bc-9b10-5e253442a1ca" />
<img width="947" height="884" alt="image" src="https://github.com/user-attachments/assets/4a63aa9b-aa37-4447-8391-12049b5404b9" />
<img width="965" height="879" alt="image" src="https://github.com/user-attachments/assets/7568b86b-38ef-4fc6-aa4d-d55e3500b533" />
<img width="986" height="862" alt="image" src="https://github.com/user-attachments/assets/fa9716df-2c0f-411a-908d-bce484e52303" />
<img width="939" height="779" alt="image" src="https://github.com/user-attachments/assets/ca4108f2-e9a8-42f8-a04d-8bf7eed0c648" />


                                                                                                  LIMITATIONS

-Context switching time is not simulated
-No support for I/O-bound processes
-Identical arrival times may cause unpredictable results in MLFQ
-No pause/resume during animation (yet)
-Designed for single-core CPU only

                                                                                          Member Roles & Contributions
                                                                                          

Kier M. Borne ------>  Backend

Jeryk Beluso   ----->  Front End
