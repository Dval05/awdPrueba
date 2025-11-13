$(function(){
  // Total estudiantes
  $.get(API_BASE_URL+"/dashboard/total_students", resp=>{
    if(resp.success) $("#totalStudents").text(resp.total);
  });

  // Total teachers
  $.get(API_BASE_URL+"/dashboard/total_teachers", resp=>{
    if(resp.success) $("#totalTeachers").text(resp.total);
  });

  // Asistencia hoy
  $.get(API_BASE_URL+"/dashboard/today_attendance", resp=>{
    if(resp.success){
      $("#todayAttendance").text(resp.percent+"%");
      $("#attendanceProgress").css("width", resp.percent+"%").attr("aria-valuenow", resp.percent);
    }
  });

  // Ingresos mes
  $.get(API_BASE_URL+"/dashboard/monthly_revenue", resp=>{
    if(resp.success) $("#monthlyRevenue").text("$"+(resp.revenue||0).toLocaleString("es-EC",{minimumFractionDigits:2}));
  });

  // Actividades recientes
  $.get(API_BASE_URL+"/dashboard/recent_activities", resp=>{
    if(resp.success && resp.data.length){
      let b = "<ul class='list-group'>";
      resp.data.forEach(a=>{
        b += `<li class='list-group-item d-flex justify-content-between align-items-center'>
          <span>${a.Name} (${a.Category||''})<br/><small>${a.ScheduledDate}</small></span>
          <span class="badge badge-${a.Status=='Completed'?'success':a.Status=='In Progress'?'info':a.Status=='Cancelled'?'danger':'secondary'}">${a.Status}</span>
        </li>`;
      });
      b+="</ul>";
      $("#recentActivities").html(b);
    }else{
      $("#recentActivities").html("<p class='text-muted text-center'>Sin actividades recientes</p>");
    }
  });

  // Pagos pendientes
  $.get(API_BASE_URL+"/dashboard/pending_payments", resp=>{
    let b = "";
    if(resp.success && resp.data.length){
      resp.data.forEach(p=>{
        b += `<tr><td>${p.FirstName} ${p.LastName}</td><td>$${p.TotalAmount}</td><td>${p.DueDate}</td></tr>`;
      });
    } else {
      b = `<tr><td colspan="3" class="text-center text-muted">Sin pagos pendientes</td></tr>`;
    }
    $("#pendingPaymentsTable").html(b);
  });

  // Próximas actividades
  $.get(API_BASE_URL+"/dashboard/upcoming_activities", resp=>{
    let b = "";
    if(resp.success && resp.data.length){
      resp.data.forEach(a=>{
        b += `<tr><td>${a.Name}</td><td>${a.ScheduledDate}</td><td>${a.Status}</td></tr>`;
      });
    } else {
      b = `<tr><td colspan="3" class="text-center text-muted">Sin próximas actividades</td></tr>`;
    }
    $("#upcomingActivitiesTable").html(b);
  });

  // Chart asistencia semanal
  $.get(API_BASE_URL+"/dashboard/attendance_week", resp=>{
    if(resp.success && window.Chart){
      let ctx = document.getElementById('attendanceChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: resp.labels,
          datasets: [{
            label: "Asistencia %",
            data: resp.data,
            borderColor: "#4e73df",
            backgroundColor: "rgba(78,115,223,0.1)",
            fill: true
          }]
        },
        options: {
          scales: {
            y: {beginAtZero: true,max:100}
          }
        }
      });
    }
  });
});
