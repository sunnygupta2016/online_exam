
function toggleHam(){
  if($('nav > li:hidden').length < 1){
    $('nav > li.overlay').hide('slow', function(){
      $('nav > li.overlay').toggleClass('overlay');  
    });
    
  }else{

    $('nav > li:hidden > .dropdown_content').css({
      "position" : "relative",
      "text-align" : "right"
    });
    $('nav > li:hidden').toggleClass('overlay').show('slow');
    $('nav li:nth-last-child(2)').css('border-radius', '0 0 1rem 1rem');
    $('nav li:nth-child(1)').css('padding-top', '.2rem');
  }
  // console.log($('nav > li:hidden'));
}

$('.dropdown_main').click(function(){
  
  var $btn = $(this);
  var count = ($btn.data("click_count") || 0) + 1;
  $btn.data("click_count", count);

  if(count > 5){
    if($(this).children('.dropdown_content').is(':visible')){
      $(this).children('.dropdown_content').hide('slow');  
    }else if($(this).children('.dropdown_content').is(':hidden')){
      $(this).children('.dropdown_content').show('slow');  
    }
  }
});



// Quiz Navigation

$(document).scroll(function(){

  let scrollTop = $(this).scrollTop();
  let bottom = $(window).scrollTop() + $(window).height();
  //console.log("bottom", bottom);
  // console.log("doc", $(document).height());

  if(Math.round(bottom) > $(document).height()-150){
    $('.col-1-quiz').css('min-height', '22rem');    
  }else if( scrollTop > 10){
    $('.col-1-quiz').css({'top' : '1rem', 'min-height' : '43rem'});
  }else {
    $('.col-1-quiz').css('top', '9.7rem');
  }

  // console.log(bottom);
  
});

$('.btn-quiz').on('click', function(e){

  let id_val = '#que-' + $(this).attr('id').split('btn-quiz-')[1];
  // console.log(id_val)

  $('html, body').animate({
    scrollTop: $(id_val).offset().top
  }, 1000);
});

$('.btn-mark').on('click',function(){
  let id_val = '#btn-quiz-' + $(this).closest('.col-2-quiz').attr('id').split('que-')[1];

  // let check_name = 'input[name=' + $(id_val).find('input').attr('name') + ']';
  let checks = $(this).closest('.options').find('input');

  // console.log(checks)

  let answered = false;

  checks.each(function(check){
    if($(this).is(':checked')){
      // $(id_val).css({'background' : 'green', 'border-color' : 'green'});  
      answered = true;
    }  
  })

  if($(id_val).css('background-color') == 'rgb(0, 0, 255)'){
    if(answered){
      $(id_val).css({'background' : 'green', 'border-color' : 'green'});   
    }else{
      $(id_val).css({'background-color' : '#cc1f16', 'border-color' : '#cc1f16'});  
    }
  }else{
    $(id_val).css({'background-color' : 'blue', 'border-color' : 'blue'});
  }

})

$('.options input').on('change', function(){

  let id_val = '#btn-quiz-' + $(this).closest('.col-2-quiz').attr('id').split('que-')[1];
  let check_name = 'input[name=' + $(this).attr('name') + ']';
  let checks = $(this).closest('.options').find(check_name);

  //console.log(checks);

  let answered = false;

  checks.each(function(check){
    if($(this).is(':checked')){
      $(id_val).css({'background' : 'green', 'border-color' : 'green'});  
      answered = true;
    }  
  })

  if(!answered){
    $(id_val).css({'background' : '#cc1f16', 'border-color' : '#cc1f16'});    
  }
  
})


// TIMER

function startTimer(duration, display) {

    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {

        if(document.querySelector('#time').textContent == '00:00'){
          // document.querySelector('.btn-form').disabled = true;
          clearInterval(countDown);
          $('.flash-msg-quiz').show();
          $('#content > *').not('.flash-msg-quiz').css('filter', 'blur(3px)');
          
          setTimeout(function(){
            $('#quiz-form').submit();
          }, 3000)
          
        }else{
          // get the number of seconds that have elapsed since 
          // startTimer() was called
          diff = duration - (((Date.now() - start) / 1000) | 0);

          // does the same job as parseInt truncates the float
          minutes = (diff / 60) | 0;
          seconds = (diff % 60) | 0;

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds; 

          if (diff <= 0) {
              // add one second so that the count down starts at the full duration
              // example 05:00 not 04:59
              start = Date.now() + 1000;
          }
        }

    };
    // we don't want to wait a full second before the timer starts
    timer();

    let countDown = setInterval(timer, 1000);
    
}



window.onload = function () {

  if (window.location.href.indexOf('/test/take/') > -1) {
    let duration = $('#duration').text()*60 ,
        display = document.querySelector('#time');
    startTimer(duration, display); 
    
    $(window).bind('beforeunload', function () {
      $("#quiz-form").submit();  
    });

    let focusCount = 0;

    $(window).blur(function(){
      // console.log('focus changed');

      focusCount++;
      if(focusCount > 4){
        $('.flash-msg-quiz').show();
          $('#content > *').not('.flash-msg-quiz').css('filter', 'blur(3px)');
          
          setTimeout(function(){
            $('#quiz-form').submit();
          }, 3000)
      }

      $('.container-flash').html(
        `<div class="flash-msg error-msg">
          One more attempt at changing tab will auto-submit the test
          <i class="fa fa-times flash-msg-close"></i>
        </div>`
      );  

      setTimeout(() => {
        $('.flash-msg.error-msg').fadeOut('800', () => { });
      }, 4000);
    });
  }

  // console.log(window.location.href);

  if (window.location.href.indexOf('/student/dashboard') > -1 || window.location.href.indexOf('/report/graph/view/') > -1){

    // $('#generateReport').on('click', function(event){
      // event.preventDefault();

      const renderChart = (marks) => {
        var ctx = document.getElementById('myChart').getContext('2d');

        const labels = [...Array(marks.length+1).keys()];

        // console.log(data)
        // console.log(Object.keys(marks).length);

        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels,
                datasets: [{
                    label: "Student Performance", 
                    data : marks,
                    backgroundColor: 'rgb(204, 31, 22)',
                    borderColor: 'rgb(0,0,0)',
                    pointBackgroundColor : 'rgb(255,255,255)'
                }]
            },

            // Configuration options go here
            options: {
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Marks in Percentage'
                  },
                  ticks: {
                    min: 0,
                    max : 100,
                    stepSize: 10,
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Test Numbers (From oldest to latest)'
                  }
                }]
              }
            }
        });
      }

      const url = `/report/graph/${$('#user_id').val()}`;
      $.ajax({
        type : "GET",
        url,
        success : function(data){
          if(data == 'error'){
            console.log('Could not render graph!');
          }else{
            data.unshift(0);
            renderChart(data);
          }
        },
        error : function(e){
            
        }

      })
    // })
  }

  if(window.location.href.indexOf('dashboard') > -1 || window.location.href.indexOf('admin') > -1){
    if($('#add-test-link') !== undefined){
      $('#add-test-link').append(`
          <li id="add-test-op">
            <ul>
              <li><i class="fas fa-arrow-circle-right"></i> <a href="/test/new">Add Test Via Form</a></li>
              <li><i class="fas fa-arrow-circle-right"></i> <a href="/test/new/xls">Upload Excel Sheet</a></li>
            </ul>
          </li>
        `)
      $('#add-test-op').hide();

      $('#add-test-link').on('click', function(e){
        if($('#add-test-op').is(':hidden'))
          $('#add-test-op').slideDown();
        else
          $('#add-test-op').slideUp();
      })
    }

    if($('#del-user-link') !== undefined){
      $('#del-user-link').append(`
          <li id="del-user-op">
            <ul>
              <li><i class="fas fa-arrow-circle-right"></i> <a href="/admin/delete/user">Delete Group</a></li>

            </ul>
          </li>
        `)
      $('#del-user-op').hide();

      $('#del-user-link').on('click', function(e){
        if($('#del-user-op').is(':hidden'))
          $('#del-user-op').slideDown();
        else
          $('#del-user-op').slideUp();
      })
    }

    if($('#add-user-link') !== undefined){
      $('#add-user-link').append(`
          <li id="add-user-op">
            <ul>
              <li><i class="fas fa-arrow-circle-right"></i> <a href="/admin/add/user">Add User Via Form</a></li>
              <li><i class="fas fa-arrow-circle-right"></i> <a href="/admin/add/user/xls">Upload Excel Sheet</a></li>
            </ul>
          </li>
        `)
      $('#add-user-op').hide();

      $('#add-user-link').on('click', function(e){
        if($('#add-user-op').is(':hidden'))
          $('#add-user-op').slideDown();
        else
          $('#add-user-op').slideUp();
      })
    }
  }
    
}


// END

// Add Test Form Scripts

$('.input-choices span:nth-of-type(1)').on('click', function(){
  let prev_name = $(this).closest('.input-choices').find('input').last().prev().attr('name');
  let name_num = parseInt(prev_name.split('op-')[1])+1;
  let name = prev_name.slice(0, prev_name.length-1) + name_num.toString();
  let check_name = name.slice(0, name.length-1) + 'correct'; 

  let type = 'radio';

  if($(this).parent().parent().children('.col-1-form').find('input:last-of-type').prop('checked')){
    type = 'checkbox';
  }

  $(this).parent().before(`<label for="ans-">Option ${name_num}</label><input type="text" name="${name}">
                  <input type="${type}" name="${check_name}" value="${name_num}" class="radio-input">
                  <label for="que-type" class="radio-label"></label>  
                `);

  if(name_num >= 5){
    $(this).hide();
  }

});

$('.input-choices span:nth-of-type(2)').on('click', function(){
  let num_input = $(this).parent().parent().find('input[type=text]'); 
  if(num_input.length > 2){
      $(this).parent().parent().find('label').last().remove();
      $(this).parent().parent().find('input').last().remove();
      $(this).parent().parent().find('input').last().remove();
      $(this).parent().parent().find('label').last().remove();
  }

  if(num_input.length == 5){
      $('.input-choices span:nth-of-type(1)').show();
  }
})


$('.col-1-form input').on('change', function(){

  if($(this).is(':last-of-type')){
    if($(this).prop('checked')){
      $(this).parent().parent().children('.input-choices').find('input').each(function(i, el){
        if(i % 2 !== 0){
          $(el).attr('type', 'checkbox')
        }
      })
    }
  }else{

    if($(this).prop('checked')){
      $(this).parent().parent().children('.input-choices').find('input').each(function(i, el){
        if(i % 2 !== 0){
          $(el).attr('type', 'radio')
        }
      })
    }    

  }

})


$('.input-choices input').each(function(){

  let op_name = $(this).attr('name');
  let name = op_name.slice(0, op_name.length-1) + 'correct';
  let op_num = op_name.split('op-')[1];

  $(this).after(`<input type="radio" name="${name}" class="radio-input" value="${op_num}">
                  <label for="que-type" class="radio-label"></label>
                `);
})


// END

// User List Scripts
$('#user_option').on('change', (e) => {
  if($('#user_option').val() == 'Student'){
    $('#group_option_container').show();
  }else{
    $('#group_option_container').hide();  
  }
})

// Report
// $('#generateReport').on('click', function(event){
//   event.preventDefault();

//   $.ajax({
//     type : "GET",
//     url : $(this).attr('href'),
//     success : function(data){
//       //console.log(data);
      
//     },
//     error : function(e){
      
//     }

//   })
// })


$('.container-flash').on('click', '.flash-msg-close', function(event){
  $(this).parent().remove();
})

// form Scripts

$('#userType').on('change', function(event){
  if($('#userType').val() == 'Student'){

    $('#userGroupOption').parent().show();
    $('#userGroupNew').parent().show();
    $('#batchFrom').parent().show();
    $('#batchTo').parent().show();

    $("input[name='role']").each( function (check) {
      if(check == 1 || check == 2){
        $(this).prop('disabled', false);
        $(this).prop('checked', true);
      }else{
        $(this).prop('disabled', true);
        $(this).prop('checked', false);  
      }
    })

  }else if($('#userType').val() == 'Faculty'){

    $('#userGroupOption').parent().hide();
    $('#userGroupNew').parent().hide();
    $('#batchFrom').parent().hide();
    $('#batchTo').parent().hide();

    $("input[name='role']").each( function (check) {
      if(check == 1){
          $(this).prop('disabled', true);
          $(this).prop('checked', false);
        }else if(check == 4){
          $(this).prop('disabled', false);
          $(this).prop('checked', false);  
      }else{
          $(this).prop('disabled', false);
          $(this).prop('checked', true);
      }
    }) 

  } else if($('#userType').val() == 'Others'){

    $('#userGroupOption').parent().hide();
    $('#userGroupNew').parent().hide();
    $('#batchFrom').parent().hide();
    $('#batchTo').parent().hide();

    $("input[name='role']").each( function (check) {
      $(this).prop('disabled', false);
      $(this).prop('checked', false);
    })
  
  }
})

$('#add_user_xls').on('submit change', () => {
  
  if ($("input[name='role']:checked").length <= 0) {
    $(".btn-submit").before(
      '<label id="role-error" class="">Please check at least one role!</label>'
    );
  }else{
    $('label#role-error').hide();  
  }

  return $("input[name='role']:checked").length > 0;  
})

$('#add_user').on('submit change', () => {
  if ($("input[name='role']:checked").length <= 0){
    $(".btn-submit").before(
      '<label id="role-error" class="">Please check at least one role!</label>'
    );
  }else{
    $('label#role-error').hide();  
  }

  return $("input[name='role']:checked").length > 0;  
})

const renderGroups = () => {
  let groupOptions = $('#userGroupOption option');
  let sectionOptions = $('#userSectionOption option');
  let filterDep = $('#department').val();
  let bFrom = $('#batchFrom').val();
  let bTo = $('#batchTo').val();

  groupOptions.each(function(){
    // console.log($(this))
    if($(this).val() == 'all'){
      return;
    }

    if($(this).val().indexOf(filterDep) > -1 && 
      $(this).val().indexOf(bFrom.split('20')[1] + bTo.split('20')[1]) > -1
    ){
      // console.log('true')
      $(this).show();
      return;
    }else{
      // console.log('false');
      $(this).hide();
    }
  })

  sectionOptions.each(function(){
    // console.log($(this))
    if($(this).val() == 'all'){
      return;
    }

    if($(this).val().indexOf(filterDep) > -1 && 
      $(this).val().indexOf(bFrom.split('20')[1] + bTo.split('20')[1]) > -1
    ){
      // console.log('true')
      $(this).show();
      return;
    }else{
      // console.log('false');
      $(this).hide();
    }
  })
}

const renderFilterOption = (el) => {
  if ($(el).val() == 'section') {
    $('#userSectionOption').parent().show();
    $('#userGroupOption').parent().hide();
    $('#studentUsername').parent().hide();
  }
  if ($(el).val() == 'group') {
    $('#userSectionOption').parent().hide();
    $('#studentUsername').parent().hide();
    $('#userGroupOption').parent().show();
  }
  if ($(el).val() == 'individual') {
    $('#userSectionOption').parent().hide();
    $('#userGroupOption').parent().hide();
    $('#studentUsername').parent().show();
  }
}



// Form Validation

$().ready(function(){

  $('.container-loading').hide();

  $(document).ajaxStart(function() {
      $('.container-loading').show();

  });

  $(document).ajaxStop(function() {
      $('.container-loading').hide();
  });

  if(window.location.href.indexOf('/admin/add/user/xls') == -1){
    setTimeout(() => {
      $('.flash-msg.success-msg').fadeOut('800', () => {});
      $('.flash-msg.error-msg').fadeOut('800', () => {});
    }, 3000)
  }


  if(window.location.href.indexOf('/test/schedule') > -1){
    renderFilterOption($("#groupFilterBy"));
    $("#groupFilterBy").on('change', function(e){
      renderFilterOption($(this));  
    })

    renderGroups(); 
    $('#batchFrom, #batchTo, #department').on('change', (e) => {
      renderGroups(); 
    })
  }


  const pat = /^[_.A-z0-9.]*[._A-z0-9.]*$/g;
  const patName = /^[A-Za-z]+$/;

  jQuery.validator.addMethod("specialChar", function(val, element){
    if(val.match(pat) !== null){
      return true;
    }else{
      return false;
    }
  }, "No spaces and only '.' and '_' are allowed in username");

  jQuery.validator.addMethod("valid_name", function(val, element){
    // console.log(pat2.test(val));
    return patName.test(val);
  }, "Names can contain only alphabets");
  
  jQuery.validator.addMethod("not_empty", function(val, element){
    
    return val !== 'null';
  }, "Please select an option!");

  jQuery.validator.addMethod("group_option", function(val, element){
    
    return $("#userGroupOption").val() !== "null" || $('#userGroupNew').val().length > 0;
  }, "Please enter a group!");

  jQuery.validator.addMethod("departmentOption", function(val, element){ 
    return $("#department").val() !== "null" || $('#departmentNew').val().length > 0;
  }, "Please enter a department name!");

  jQuery.validator.addMethod("subject_option", function(val, element){
    
    return $("#subjectOption").val() !== "null" || $('#subjectNew').val().length > 0;
  }, "Please enter a subject!");


  
  $('#add_user').validate({
    rules:{
      username: {
        specialChar: true,
        required: true,
        rangelength: [2,15],
        
      },
      email: "required",
      password: {
        required: true,
        rangelength: [5,50],
      },
      confirm: {
        required: true,
        equalTo: "#password"
      },
      status1: {
        required: true,
      },
      status2: {
        required: true,
      },
      userType: {
        required: true,
      },
      userGroupOption: {
        group_option: true
      },
      userGroupNew: {
        group_option: true
      },
      department : {
        departmentOption : true
      },
      departmentNew : {
        departmentOption: true
      }
    },
    messages:{
      username: {
        required: "Please enter your username",
        rangelength : "Enter a username between 2 and 15 characters"
      },
      email : "Please enter a valid email",
      password:{
        required: "Please enter a password",
        rangelength: "Please enter a password between 5 to 50 characters"
      },
      confirm:{
        required: "Please confirm your password",
        equalTo: "Password did not match"
      }
    }
  })

  $('#add_user_xls').validate({
    rules:{
      userGroupOption : {
        group_option : true
      },
      userGroupNew : {
        group_option : true
      },
      department: {
        departmentOption: true
      },
      departmentNew: {
        departmentOption: true
      },
      batchFrom : {
        required : true,
      },
      batchTo : {
        required : true,
      },
      file : {
        required : true,
      },
    },
    messages:{
      batchFrom: {
        required: "This field is required!",
      },
      batchTo: {
        required: "This field is required!",
      },
      file: {
        required: "This field is required!",
      },
    }
  })

  $('#edit_user').validate({
    rules:{
      username: {
        specialChar: true,
        required: true,
        rangelength: [2,15],
        
      },
      email: "required",
      password: {
        required: false,
        rangelength: [5,50],
      },
      confirm: {
        required: false,
        equalTo: "#password"
      },
      status1: {
        required: true,
      },
      status2: {
        required: true,
      },
      userType: {
        required: true,
      },
    },
    messages:{
      username: {
        required: "Please enter your username",
        rangelength : "Enter a username between 2 and 15 characters"
      },
      email : "Please enter a valid email",
      password:{
        required: "Please enter a password",
        rangelength: "Please enter a password between 5 to 50 characters"
      },
      confirm:{
        required: "Please confirm your password",
        equalTo: "Password did not match"
      }
    }
  })


   $('#login_student').validate({
      rules:{
        username: {
          required: true,
          specialChar: true
        },
        password: 'required'
      },
      messages:{
        username: {
            required: "Please enter your username"
          },
        password:{
          required: "Please enter a password"
        }
      }
    })  
    
    $('#login_faculty').validate({
      rules:{
        username: {
          required: true,
          specialChar: true
        },
        password: 'required'
      },
      messages:{
        username: {
            required: "Please enter your username"
          },
        password:{
          required: "Please enter a password"
        }
      }
    })  

  $("#schedule_test").validate({
    rules: {
      testOp: {
        not_empty : true,
        required: true
      },
      userGroupOption: {
        not_empty : true,
        required: true
      },
      userSectionOption : {
        not_empty: true,
        required: true
      },
      studentUsername:{
        required: true
      },
      date: {
        required: true
      },
      time: {
        required: true
      },
      duration: {
        required: true
      },
      department : {
        not_empty : true,
        required: true
      }
    },
    messages: {
      testOp: {
        required: "This field is required!"
      },
      userGroupOption: {
        required: "This field is required!"
      },
      userSectionOption: {
        required: "This field is required!"
      },
      studentUsername: {
        required: "This field is required!"
      },
      date: {
        required: "This field is required!"
      },
      time: {
        required: "This field is required!"
      },
      duration: {
        required: "This field is required!"
      }
    }
  });  

  $('#add_test_info_subject').validate({
    rules : {
      title : {
        required : true
      },
      subjectOption : {
        subject_option : true
      },
      subjectNew : {
        subject_option : true
      },
      queNo : {
        required : true
      },
    },
    messages : {
      title: {
        required: "This field is required!"
      },
      queNo: {
        required: "This field is required!"
      },
    }
  })

  $('#add_test_info').validate({
    rules : {
      title : {
        required : true
      },
      subNo : {
        required : true
      },
    },
    messages : {
      title: {
        required: "This field is required!"
      },
      subNo: {
        required: "This field is required!"
      },
    }
  })

  $('#add_test_xls').validate({
    rules : {
      title : {
        required : true
      },
      subjectOption : {
        subject_option : true
      },
      subjectNew : {
        subject_option : true
      },
      file : {
        required : true
      },
    },
    messages : {
      title : {
        required : "This field is required!"
      },
      file : {
        required : "This field is required!"
      },
    }
  })


})


