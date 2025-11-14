$(function() {
  // Cargar opciones de grado (antes de mostrar el modal)
  function loadGrades(selectedId) {
    $.get(API_BASE_URL+"/grades", function(resp) {
      let html = `<option value="">-- Seleccione --</option>`;
      if(resp.success && Array.isArray(resp.data)) {
        resp.data.forEach(g => {
          html += `<option value="${g.GradeID}" ${selectedId && selectedId == g.GradeID ? "selected" : ""}>${g.GradeName || g.GradeID}</option>`;
        });
      }
      $("#GradeID").html(html);
    });
  }

  // Cargar empleados/docentes
  function loadTeachers(selectedId) {
    $.get(API_BASE_URL+"/employees", function(resp){
      let html = `<option value="">-- Sin asignar --</option>`;
      if(resp.success && Array.isArray(resp.data)) {
        resp.data.forEach(t => {
          html += `<option value="${t.EmpID}" ${selectedId && selectedId == t.EmpID ? "selected" : ""}>${t.FirstName} ${t.LastName}</option>`;
        });
      }
      $("#EmpID").html(html);
    });
  }

  // Mostrar modal y poblar selects para crear
  $("#btnCreateActivity").click(function() {
    $("#activityForm")[0].reset();
    $("#ActivityID").val("");
    $("#activityModalLabel").text("Crear Actividad");
    loadGrades();
    loadTeachers();
    $("#activityModal").modal("show");
    // Al volver a enviar el form, reatacha el manejador único
    $("#activityForm").off("submit").on("submit", function(e){
      e.preventDefault();
      saveActivity();
    });
  });

  // Guardar (crear o editar)
  function saveActivity() {
    let id = $("#ActivityID").val();
    let payload = {
      Name: $("#Name").val(),
      Description: $("#Description").val(),
      GradeID: $("#GradeID").val(),
      EmpID: $("#EmpID").val(),
      ScheduledDate: $("#ScheduledDate").val(),
      StartTime: $("#StartTime").val(),
      EndTime: $("#EndTime").val(),
      Location: $("#Location").val(),
      Category: $("#Category").val(),
      Status: $("#Status").val()
    };
    let url, msgOk;
    if (id) {
      payload.ActivityID = id;
      url = API_BASE_URL+"/activities/update";
      msgOk = "Actividad actualizada.";
    } else {
      url = API_BASE_URL+"/activities/create";
      msgOk = "Actividad creada correctamente.";
    }
    $.ajax({
      url: url,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function(resp) {
        if(resp.success) {
          $("#activityModal").modal("hide");
          loadActivities();
          alert(msgOk);
        } else {
          alert(resp.message || "Error al guardar la actividad.");
        }
      }
    });
  }

  // Listar actividades
  function loadActivities() {
    $.get(API_BASE_URL+"/activities", function(resp){
      let html = "";
      if(resp.success && Array.isArray(resp.data)) {
        resp.data.forEach(a => {
          html += `
            <tr>
              <td>${a.Name}</td>
              <td>${a.ScheduledDate||""}</td>
              <td>${a.GradeName||"--"}</td>
              <td>${a.TeacherFirstName||""} ${a.TeacherLastName||""}</td>
              <td>${a.Category||""}</td>
              <td>${a.Status||""}</td>
              <td>
                <button class='btn btn-info btn-sm btn-edit' data-id='${a.ActivityID}'>Editar</button>
                <button class='btn btn-danger btn-sm btn-delete' data-id='${a.ActivityID}'>Eliminar</button>
              </td>
            </tr>`;
        });
      } else {
        html = "<tr><td colspan='7' class='text-center text-muted'>No hay actividades</td></tr>";
      }
      $("#activitiesTableBody").html(html);
    });
  }

  $("#activityForm").on("submit", function(e){
  e.preventDefault();
  let form = $(this)[0];
  let formData = new FormData(form);

  // Extras: puedes añadir más datos de usuario si no van en los inputs
  // formData.append('CreatedBy', ...);

  // Si es edición:
  let isEdit = !!$("#ActivityID").val();
  let url = isEdit 
  ? API_BASE_URL+"/activities/update" 
  : API_BASE_URL+"/activities/create";
  
  $.ajax({
    url: url,
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(resp){
      if(resp.success){
        $("#activityModal").modal("hide");
        loadActivities();
        alert(isEdit ? "Actividad actualizada." : "Actividad creada correctamente.");
      } else {
        alert(resp.message||"Error al guardar");
      }
    }
  });
});

  // Acción editar
  $("#activitiesTableBody").on("click", ".btn-edit", function() {
    let id = $(this).data("id");
    $.get(API_BASE_URL+"/activities/get_by_id?id=" + id, function(resp){
      if(resp.success && resp.data){
        let a = resp.data;
        $("#ActivityID").val(a.ActivityID);
        $("#Name").val(a.Name);
        $("#Description").val(a.Description);
        loadGrades(a.GradeID);
        loadTeachers(a.EmpID);
        $("#ScheduledDate").val(a.ScheduledDate);
        $("#StartTime").val(a.StartTime);
        $("#EndTime").val(a.EndTime);
        $("#Location").val(a.Location);
        $("#Category").val(a.Category);
        $("#Status").val(a.Status);
        $("#activityModalLabel").text("Editar Actividad");
        $("#activityModal").modal("show");
        $("#activityForm").off("submit").on("submit", function(e){
          e.preventDefault();
          saveActivity();
        });
      }
    });
  });

  // Acción eliminar
  $("#activitiesTableBody").on("click", ".btn-delete", function() {
    let id = $(this).data("id");
    if(confirm("¿Eliminar actividad?")) {
      $.ajax({
        url: API_BASE_URL+"/activities/delete",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ ActivityID: id }),
        success: function(resp){
          if(resp.success){ loadActivities(); }
          else { alert(resp.message || "Error al eliminar"); }
        }
      });
    }
  });

  // Cargar tabla al iniciar
  loadActivities();
});
