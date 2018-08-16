$(document).ready(() => {
  
  if (
    localStorage.getItem("loggedIn") === undefined ||
    localStorage.getItem("loggedIn") === null
  ) {
    window.location.replace("/admin/login.html");
  }
  
  getcurrentUserFromLocalStorage = () => {
    return localStorage.getItem("currentUser");
  };



  CURRENT_USER = getcurrentUserFromLocalStorage();
  ATTENDANCE_LIST = [];
  ANSWERS_LIST = [];
  WHOLE_USER_DATA = {};
  const username = localStorage.getItem('mobileNumber');
  const password = localStorage.getItem('otp');
  const $userName = $("#userName");
  const $pageheading = $("#pageheading");
  const $gender = $("#gender");
  const $mobileNumber = $("#mobileNumber");
  const $totalPresent = $("#totalPresent");
  const $totalAbsent = $("#totalAbsent");
  const $percentPresent = $("#percent_present");
  const $table = $("#user-metric-table");

  /**
   * Assesment Related Variables
   */

  // BALANCE
  const $balance_eyes_closed_left = $('[name="balance_eyes_closed_left"]');
  const $balance_eyes_closed_right = $('[name="balance_eyes_closed_right"]');
  const $balance_eyes_opened_left = $('[name="balance_eyes_opened_left"]');
  const $balance_eyes_opened_right = $('[name="balance_eyes_opened_right"]');

  // FLEXIBILITY
  const $toeTouch = $("#toeTouch");
  const $sitAndReach = $("#sitAndReach");
  const $cobra = $("#cobra");
  const $quad = $("#quad");

  //STRENGTH
  const $strength_plank = $('[name="plank"]');
  const $strength_squat_hold = $('[name="squat_hold"]');
  const $strength_pushups = $('[name="pushups"]');
  const $strength_pullups = $('[name="pullups"]');
  const $strength_chin_ups = $('[name="chin_ups"]');
  const $strength_squat = $('[name="squat"]');

  //1RM
  const $bicep_curl_left = $("#bicep_curl_left");
  const $bicep_curl_right = $("#bicep_curl_right");

  const $tricep_extension_left = $("#tricep_extension_left");
  const $tricep_extension_right = $("#tricep_extension_right");

  const $bench_press_left = $("#bench_press_left");
  const $bench_press_right = $("#bench_press_right");

  const $shoulder_press_left = $("#shoulder_press_left");
  const $shoulder_press_right = $("#shoulder_press_right");

  //MUSCLE ENDURANCE

  const $muscle_triceps_extension_maxkgleft = $(
    "#muscle_triceps_extension_maxkgleft"
  );
  const $muscle_triceps_extension_5rm_rightright = $(
    "#muscle_triceps_extension_5rm_rightright"
  );
  const $muscle_triceps_extension_5rm_leftleft = $(
    "#muscle_triceps_extension_5rm_leftleft"
  );
  const $muscle_triceps_extension_10rm_rightleft = $(
    "#muscle_triceps_extension_10rm_rightleft"
  );
  const $muscle_triceps_extension_10rm_leftleft = $(
    "#muscle_triceps_extension_10rm_leftleft"
  );

  const $muscle_bench_press_maxkgleft = $("#muscle_bench_press_maxkgleft");
  const $muscle_bench_press_5rm_rightright = $(
    "#muscle_bench_press_5rm_rightright"
  );
  const $muscle_bench_press_5rm_leftleft = $(
    "#muscle_bench_press_5rm_leftleft"
  );
  const $muscle_bench_press_10rm_rightleft = $(
    "#muscle_bench_press_10rm_rightleft"
  );
  const $muscle_bench_press_10rm_leftleft = $(
    "#muscle_bench_press_10rm_leftleft"
  );

  const $muscle_shoulder_press_maxkgleft = $(
    "#muscle_shoulder_press_maxkgleft"
  );
  const $muscle_shoulder_press_5rm_rightright = $(
    "#muscle_shoulder_press_5rm_rightright"
  );
  const $muscle_shoulder_press_5rm_leftleft = $(
    "#muscle_shoulder_press_5rm_leftleft"
  );
  const $muscle_shoulder_press_10rm_rightleft = $(
    "#muscle_shoulder_press_10rm_rightleft"
  );
  const $muscle_shoulder_press_10rm_leftleft = $(
    "#muscle_shoulder_press_10rm_leftleft"
  );

  const $muscle_squats_maxkgleft = $("#muscle_squats_maxkgleft");
  const $muscle_squats_5rm_rightright = $("#muscle_squats_5rm_rightright");
  const $muscle_squats_5rm_leftleft = $("#muscle_squats_5rm_leftleft");
  const $muscle_squats_10rm_rightleft = $("#muscle_squats_10rm_rightleft");
  const $muscle_squats_10rm_leftleft = $("#muscle_squats_10rm_leftleft");

  const $muscle_biceps_curl_maxkgleft = $("#muscle_biceps_curl_maxkgleft");
  const $muscle_biceps_curl_5rm_rightright = $(
    "#muscle_biceps_curl_5rm_rightright"
  );
  const $muscle_biceps_curl_5rm_leftleft = $(
    "#muscle_biceps_curl_5rm_leftleft"
  );
  const $muscle_biceps_curl_10rm_rightleft = $(
    "#muscle_biceps_curl_10rm_rightleft"
  );
  const $muscle_biceps_curl_10rm_leftleft = $(
    "#muscle_biceps_curl_10rm_leftleft"
  );

  //CARDIOVASCULAR
  const $cardio_low_intensity_jog = $("#cardio_low_intensity_jog");
  const $cardio_medium_intensity_jog = $("#cardio_medium_intensity_jog");
  const $cardio_high_intensity_jog = $("#cardio_high_intensity_jog");

  //POSTURE
  const $posture_anterior_neck = $("#posture_anterior_neck");
  const $posture_anterior_shoulder = $("#posture_anterior_shoulder");
  const $posture_anterior_arm = $("#posture_anterior_arm");
  const $posture_anterior_trunk = $("#posture_anterior_trunk");
  const $posture_anterior_back = $("#posture_anterior_back");
  const $posture_anterior_legs = $("#posture_anterior_legs");

  const $posture_lateral_neck = $("#posture_lateral_neck");
  const $posture_lateral_shoulder = $("#posture_lateral_shoulder");
  const $posture_lateral_arm = $("#posture_lateral_arm");
  const $posture_lateral_trunk = $("#posture_lateral_trunk");
  const $posture_lateral_back = $("#posture_lateral_back");
  const $posture_lateral_legs = $("#posture_lateral_legs");

  const $posture_posterior_neck = $("#posture_posterior_neck");
  const $posture_posterior_shoulder = $("#posture_posterior_shoulder");
  const $posture_posterior_arm = $("#posture_posterior_arm");
  const $posture_posterior_trunk = $("#posture_posterior_trunk");
  const $posture_posterior_back = $("#posture_posterior_back");
  const $posture_posterior_legs = $("#posture_posterior_legs");
  const asessmentTemplate = {
    data: {
      balance: {
        eyesOpened: {
          left: {
            lessThan30: {
              value: 0
            },
            greaterThanEqualTo30: {
              value: 0
            },
            equalTo60: {
              value: 0
            }
          },
          right: {
            lessThan30: {
              value: 0
            },
            greaterThanEqualTo30: {
              value: 0
            },
            equalTo60: {
              value: 0
            }
          }
        },
        eyesClosed: {
          left: {
            lessThan30: {
              value: 0
            },
            greaterThanEqualTo30: {
              value: 0
            },
            equalTo60: {
              value: 0
            }
          },
          right: {
            lessThan30: {
              value: 0
            },
            greaterThanEqualTo30: {
              value: 0
            },
            equalTo60: {
              value: 0
            }
          }
        }
      },
      flexibility: {
        toeTouch: {
          yes: {
            value: 0
          },
          no: {
            value: 0
          }
        },
        sitAndReach: {
          yes: {
            value: 0
          },
          no: {
            value: 0
          }
        },
        cobra: {
          yes: {
            value: 0
          },
          no: {
            value: 0
          }
        },
        quad: {
          yes: {
            value: 0
          },
          no: {
            value: 0
          }
        }
      },
      strength: {
        plank: {
          lessThan30: {
            value: 0
          },
          greaterThanEqualTo30: {
            value: 0
          },
          equalTo60: {
            value: 0
          }
        },
        squatHold: {
          lessThan30: {
            value: 0
          },
          greaterThanEqualTo30: {
            value: 0
          },
          equalTo60: {
            value: 0
          }
        },
        pushUps: {
          lessThan30: {
            value: 0
          },
          greaterThanEqualTo30: {
            value: 0
          },
          equalTo60: {
            value: 0
          }
        },
        pullUps: {
          lessThan30: {
            value: 0
          },
          greaterThanEqualTo30: {
            value: 0
          },
          equalTo60: {
            value: 0
          }
        },
        chinUps: {
          lessThan30: {
            value: 0
          },
          greaterThanEqualTo30: {
            value: 0
          },
          equalTo60: {
            value: 0
          }
        },
        squat: {
          lessThan30: {
            value: 0
          },
          greaterThanEqualTo30: {
            value: 0
          },
          equalTo60: {
            value: 0
          }
        }
      },
      oneRm: {
        bicepCurl: {
          maxKgLeft: {
            value: 0
          },
          maxKgRight: {
            value: 0
          }
        },
        singleArmTricepExtension: {
          maxKgLeft: {
            value: 0
          },
          maxKgRight: {
            value: 0
          }
        },
        benchPressChest: {
          maxKgLeft: {
            value: 0
          },
          maxKgRight: {
            value: 0
          }
        },
        shoulderPress: {
          maxKgLeft: {
            value: 0
          },
          maxKgRight: {
            value: 0
          }
        }
      },
      muscleEndurance: {
        bicepCurl: {
          kg: {
            value: 0
          },
          fiveRmLeft: {
            value: 0
          },
          fiveRmRight: {
            value: 0
          },
          tenRmLeft: {
            value: 0
          },
          tenRmRight: {
            value: 0
          }
        },
        singleArmTricepExtension: {
          kg: {
            value: 0
          },
          fiveRmLeft: {
            value: 0
          },
          fiveRmRight: {
            value: 0
          },
          tenRmLeft: {
            value: 0
          },
          tenRmRight: {
            value: 0
          }
        },
        benchPressChest: {
          kg: {
            value: 0
          },
          fiveRmLeft: {
            value: 0
          },
          fiveRmRight: {
            value: 0
          },
          tenRmLeft: {
            value: 0
          },
          tenRmRight: {
            value: 0
          }
        },
        shoulderPress: {
          kg: {
            value: 0
          },
          fiveRmLeft: {
            value: 0
          },
          fiveRmRight: {
            value: 0
          },
          tenRmLeft: {
            value: 0
          },
          tenRmRight: {
            value: 0
          }
        },
        squat: {
          kg: {
            value: 0
          },
          fiveRmLeft: {
            value: 0
          },
          fiveRmRight: {
            value: 0
          },
          tenRmLeft: {
            value: 0
          },
          tenRmRight: {
            value: 0
          }
        }
      },
      cardiovascular: {
        lowIntensity: {
          twelveMinJogOrWalk: {
            value: 0
          }
        },
        mediumIntensity: {
          twelveMinJogOrWalk: {
            value: 0
          }
        },
        highIntensity: {
          twelveMinJogOrWalk: {
            value: 0
          }
        }
      },
      posture: {
        anterior: {
          neck: {
            value: 0
          },
          shoulders: {
            value: 0
          },
          arm: {
            value: 0
          },
          trunk: {
            value: 0
          },
          back: {
            value: 0
          },
          legs: {
            value: 0
          }
        },
        lateral: {
          neck: {
            value: 0
          },
          shoulders: {
            value: 0
          },
          arm: {
            value: 0
          },
          trunk: {
            value: 0
          },
          back: {
            value: 0
          },
          legs: {
            value: 0
          }
        },
        posterior: {
          neck: {
            value: 0
          },
          shoulders: {
            value: 0
          },
          arm: {
            value: 0
          },
          trunk: {
            value: 0
          },
          back: {
            value: 0
          },
          legs: {
            value: 0
          }
        }
      }
    }
  };

  if (CURRENT_USER === null || CURRENT_USER === undefined) {
    window.location.replace("/admin");
  }

  $('#userTab a[href="#main"]').on("click", function(e) {
    e.preventDefault();
    //  console.log(e, "clicked main");
    $('#userTab a[href="#main"]').tab("show"); // Select tab by name
  });
  $('#userTab a[href="#assesment"]').on("click", function(e) {
    e.preventDefault();
    //  console.log(e, "clicked assesment");
    $('#userTab a[href="#assesment"]').tab("show"); // Select tab by name
  });

  /**
   * ============================================
   * GET BASIC DETAILS
   * ============================================
   */
  settings = {
    url: "http://139.59.80.139/api/v1/cms/users/" + CURRENT_USER,
    method: "GET",

    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        // "Basic " + btoa(username + ":" + password)
        "Bearer " + localStorage.getItem("token")
      );
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    }
  };
  $.ajax(settings).done(data => {
    //  console.log("BASIC DATA for", CURRENT_USER, data);
    WHOLE_USER_DATA = data;
    $userName.text(data.name);
    $pageheading.text(data.name + "'s Profile");
    $gender.text(data.gender);
    $mobileNumber.text(data.mobileNumber);
  });

  /**
   * ============================================
   * GET ATTENDANCE DETAILS
   * ============================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/attendance/",
    username,
    password,
    1,
    "user=" + CURRENT_USER
  )
    .then(data => {
      const user_pagination = data.map(datum => {
        const a = [];
        datum.Attendance.map(attendance => {
          //   //  console.log(attendance);
          ATTENDANCE_LIST.push(attendance);
        });

        return a;
      });
      //   //  console.log("paginated data", ATTENDANCE_LIST);
      let present = 0;
      let absent = 0;
      let percent_of_present = 0;
      ATTENDANCE_LIST.map(attendance => {
        attendance.status ? (present = present + 1) : (absent = absent + 1);
      });
      $totalPresent.text(present);
      $totalAbsent.text(absent);
      percent_of_present = (present / ATTENDANCE_LIST.length) * 100;
      $percentPresent.text(
        ATTENDANCE_LIST.length === 0
          ? "Insuficent Data"
          : percent_of_present.toFixed(2) + "%"
      );
    })
    .catch(err => {
      //  console.log("error in paginatedAjax", err);
    });

  /**
   * ============================================
   * GET METRICS DETAILS
   * ============================================
   */
  PaginatedAjax.get(
    "http://139.59.80.139/api/v1/cms/answers/",
    username,
    password,
    1,
    "user=" + CURRENT_USER
  )
    .then(data => {
      const user_pagination = data.map(datum => {
        const a = [];
        datum.Answers.map(answer => {
          // //  console.log(answer);
          ANSWERS_LIST.push(answer);
        });

        return a;
      });
      //   //  console.log("paginated data", ANSWERS_LIST);
      let present = 0;
      let absent = 0;
      let percent_of_present = 0;
      ANSWERS_LIST.map(answer => {
        $table.append(
          `<tr data-mid = "${answer._id}"><td>${
            answer.type
          }</td><td> ${answer.value.toFixed(2)}</td><td>
            ${answer.modifiedAt.split("T")[0]}</td><td>`
        );
        // <a data-toggle="tooltip" data-placement="top" title="Edit">
        // <i class="fa fa-pencil text-inverse m-r-10"></i></a></span>
        // <span onclick="deleteRow(this)">
        // <a data-toggle="tooltip" data-placement="top" title="Delete">
        // <i class="fa fa-trash text-inverse m-r-10"></i></a>
        // </span>
      });
      $("#user-metric-table").footable({
        sorting: {
          enabled: true
        }
      });
    })
    .catch(err => {
      //  console.log("error in paginatedAjax", err);
    });


  getCheckedRadio = (radiogroup, valueToUpdate) => {
    $.each(radiogroup, (index, value) => {
      let i = 0;
      if (value.checked) {
        i = index + 1;
      }
      switch (i) {
        case 1:
          valueToUpdate.lessThan30.value = 1;
          break;
        case 2:
          valueToUpdate.greaterThanEqualTo30.value = 1;
          break;
        case 3:
          valueToUpdate.equalTo60.value = 1;
          break;
      }
    });
  };
  enableCheckBoxValue = (checkbox, valueToUpdate) => {
    //  console.log(checkbox[0].checked);
    if (checkbox[0].checked) {
      valueToUpdate.yes.value = 1;
    } else {
      valueToUpdate.no.value = 1;
    }
  };
  getTextBoxValAndUpdate = (textbox, valueToUpdate) => {
    valueToUpdate.value = textbox.val();
  };
  saveAssesment = function() {
    //BALANCE
    //EYES CLOSED LEFT
    getCheckedRadio(
      $balance_eyes_closed_left,
      asessmentTemplate.data.balance.eyesClosed.left
    );
    //EYES CLOSED RIGHT
    getCheckedRadio(
      $balance_eyes_closed_right,
      asessmentTemplate.data.balance.eyesClosed.right
    );
    //EYES OPENED LEFT
    getCheckedRadio(
      $balance_eyes_opened_left,
      asessmentTemplate.data.balance.eyesOpened.left
    );
    //EYES OPENED LEFT
    getCheckedRadio(
      $balance_eyes_opened_right,
      asessmentTemplate.data.balance.eyesOpened.right
    );

    //FLEXIBILITY
    //TOETOUCH
    enableCheckBoxValue($toeTouch, asessmentTemplate.data.flexibility.toeTouch);
    //SITANDREACH
    enableCheckBoxValue(
      $sitAndReach,
      asessmentTemplate.data.flexibility.sitAndReach
    );
    //COBRA
    enableCheckBoxValue($cobra, asessmentTemplate.data.flexibility.cobra);
    //SQUAD
    enableCheckBoxValue($quad, asessmentTemplate.data.flexibility.quad);

    //STRENGTH
    getCheckedRadio($strength_plank, asessmentTemplate.data.strength.plank);
    getCheckedRadio(
      $strength_squat_hold,
      asessmentTemplate.data.strength.squatHold
    );
    getCheckedRadio($strength_pushups, asessmentTemplate.data.strength.pushUps);
    getCheckedRadio($strength_pullups, asessmentTemplate.data.strength.pullUps);
    getCheckedRadio(
      $strength_chin_ups,
      asessmentTemplate.data.strength.chinUps
    );
    getCheckedRadio($strength_squat, asessmentTemplate.data.strength.squat);

    //1RM
    getTextBoxValAndUpdate(
      $bicep_curl_left,
      asessmentTemplate.data.oneRm.bicepCurl.maxKgLeft
    );
    getTextBoxValAndUpdate(
      $bicep_curl_right,
      asessmentTemplate.data.oneRm.bicepCurl.maxKgRight
    );
    getTextBoxValAndUpdate(
      $tricep_extension_left,
      asessmentTemplate.data.oneRm.singleArmTricepExtension.maxKgLeft
    );
    getTextBoxValAndUpdate(
      $tricep_extension_right,
      asessmentTemplate.data.oneRm.singleArmTricepExtension.maxKgRight
    );
    getTextBoxValAndUpdate(
      $bench_press_right,
      asessmentTemplate.data.oneRm.benchPressChest.maxKgLeft
    );
    getTextBoxValAndUpdate(
      $bench_press_left,
      asessmentTemplate.data.oneRm.benchPressChest.maxKgRight
    );
    getTextBoxValAndUpdate(
      $shoulder_press_left,
      asessmentTemplate.data.oneRm.shoulderPress.maxKgLeft
    );
    getTextBoxValAndUpdate(
      $shoulder_press_right,
      asessmentTemplate.data.oneRm.shoulderPress.maxKgRight
    );

    //MUSCLE ENDURANCE

    getTextBoxValAndUpdate(
      $muscle_biceps_curl_maxkgleft,
      asessmentTemplate.data.muscleEndurance.bicepCurl.kg
    );
    getTextBoxValAndUpdate(
      $muscle_biceps_curl_5rm_leftleft,
      asessmentTemplate.data.muscleEndurance.bicepCurl.fiveRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_biceps_curl_5rm_rightright,
      asessmentTemplate.data.muscleEndurance.bicepCurl.fiveRmRight
    );
    getTextBoxValAndUpdate(
      $muscle_biceps_curl_10rm_leftleft,
      asessmentTemplate.data.muscleEndurance.bicepCurl.tenRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_biceps_curl_10rm_rightleft,
      asessmentTemplate.data.muscleEndurance.bicepCurl.tenRmRight
    );

    getTextBoxValAndUpdate(
      $muscle_triceps_extension_maxkgleft,
      asessmentTemplate.data.muscleEndurance.singleArmTricepExtension.kg
    );
    getTextBoxValAndUpdate(
      $muscle_triceps_extension_5rm_leftleft,
      asessmentTemplate.data.muscleEndurance.singleArmTricepExtension.fiveRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_triceps_extension_5rm_rightright,
      asessmentTemplate.data.muscleEndurance.singleArmTricepExtension
        .fiveRmRight
    );
    getTextBoxValAndUpdate(
      $muscle_triceps_extension_10rm_leftleft,
      asessmentTemplate.data.muscleEndurance.singleArmTricepExtension.tenRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_triceps_extension_10rm_rightleft,
      asessmentTemplate.data.muscleEndurance.singleArmTricepExtension.tenRmRight
    );

    getTextBoxValAndUpdate(
      $muscle_bench_press_maxkgleft,
      asessmentTemplate.data.muscleEndurance.benchPressChest.kg
    );
    getTextBoxValAndUpdate(
      $muscle_bench_press_5rm_leftleft,
      asessmentTemplate.data.muscleEndurance.benchPressChest.fiveRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_bench_press_5rm_rightright,
      asessmentTemplate.data.muscleEndurance.benchPressChest.fiveRmRight
    );
    getTextBoxValAndUpdate(
      $muscle_bench_press_10rm_leftleft,
      asessmentTemplate.data.muscleEndurance.benchPressChest.tenRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_bench_press_10rm_rightleft,
      asessmentTemplate.data.muscleEndurance.benchPressChest.tenRmRight
    );

    getTextBoxValAndUpdate(
      $muscle_shoulder_press_maxkgleft,
      asessmentTemplate.data.muscleEndurance.shoulderPress.kg
    );
    getTextBoxValAndUpdate(
      $muscle_shoulder_press_5rm_leftleft,
      asessmentTemplate.data.muscleEndurance.shoulderPress.fiveRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_shoulder_press_5rm_rightright,
      asessmentTemplate.data.muscleEndurance.shoulderPress.fiveRmRight
    );
    getTextBoxValAndUpdate(
      $muscle_shoulder_press_10rm_leftleft,
      asessmentTemplate.data.muscleEndurance.shoulderPress.tenRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_shoulder_press_10rm_rightleft,
      asessmentTemplate.data.muscleEndurance.shoulderPress.tenRmRight
    );

    getTextBoxValAndUpdate(
      $muscle_squats_maxkgleft,
      asessmentTemplate.data.muscleEndurance.squat.kg
    );
    getTextBoxValAndUpdate(
      $muscle_squats_5rm_leftleft,
      asessmentTemplate.data.muscleEndurance.squat.fiveRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_squats_5rm_rightright,
      asessmentTemplate.data.muscleEndurance.squat.fiveRmRight
    );
    getTextBoxValAndUpdate(
      $muscle_squats_10rm_leftleft,
      asessmentTemplate.data.muscleEndurance.squat.tenRmLeft
    );
    getTextBoxValAndUpdate(
      $muscle_squats_10rm_rightleft,
      asessmentTemplate.data.muscleEndurance.squat.tenRmRight
    );

    //CARDIOVASCULAR
    getTextBoxValAndUpdate(
      $cardio_low_intensity_jog,
      asessmentTemplate.data.cardiovascular.lowIntensity.twelveMinJogOrWalk
    );
    getTextBoxValAndUpdate(
      $cardio_medium_intensity_jog,
      asessmentTemplate.data.cardiovascular.mediumIntensity.twelveMinJogOrWalk
    );
    getTextBoxValAndUpdate(
      $cardio_high_intensity_jog,
      asessmentTemplate.data.cardiovascular.highIntensity.twelveMinJogOrWalk
    );

    //POSTURE
    getTextBoxValAndUpdate(
      $posture_anterior_neck,
      asessmentTemplate.data.posture.anterior.neck
    );
    getTextBoxValAndUpdate(
      $posture_anterior_shoulder,
      asessmentTemplate.data.posture.anterior.shoulders
    );
    getTextBoxValAndUpdate(
      $posture_anterior_arm,
      asessmentTemplate.data.posture.anterior.arm
    );
    getTextBoxValAndUpdate(
      $posture_anterior_trunk,
      asessmentTemplate.data.posture.anterior.trunk
    );
    getTextBoxValAndUpdate(
      $posture_anterior_back,
      asessmentTemplate.data.posture.anterior.back
    );
    getTextBoxValAndUpdate(
      $posture_anterior_legs,
      asessmentTemplate.data.posture.anterior.legs
    );

    getTextBoxValAndUpdate(
      $posture_lateral_neck,
      asessmentTemplate.data.posture.lateral.neck
    );
    getTextBoxValAndUpdate(
      $posture_lateral_shoulder,
      asessmentTemplate.data.posture.lateral.shoulders
    );
    getTextBoxValAndUpdate(
      $posture_lateral_arm,
      asessmentTemplate.data.posture.lateral.arm
    );
    getTextBoxValAndUpdate(
      $posture_lateral_trunk,
      asessmentTemplate.data.posture.lateral.trunk
    );
    getTextBoxValAndUpdate(
      $posture_lateral_back,
      asessmentTemplate.data.posture.lateral.back
    );
    getTextBoxValAndUpdate(
      $posture_lateral_legs,
      asessmentTemplate.data.posture.lateral.legs
    );

    getTextBoxValAndUpdate(
      $posture_posterior_neck,
      asessmentTemplate.data.posture.posterior.neck
    );
    getTextBoxValAndUpdate(
      $posture_posterior_shoulder,
      asessmentTemplate.data.posture.posterior.shoulders
    );
    getTextBoxValAndUpdate(
      $posture_posterior_arm,
      asessmentTemplate.data.posture.posterior.arm
    );
    getTextBoxValAndUpdate(
      $posture_posterior_trunk,
      asessmentTemplate.data.posture.posterior.trunk
    );
    getTextBoxValAndUpdate(
      $posture_posterior_back,
      asessmentTemplate.data.posture.posterior.back
    );
    getTextBoxValAndUpdate(
      $posture_posterior_legs,
      asessmentTemplate.data.posture.posterior.legs
    );
    //  console.log(asessmentTemplate);

    //POST EVERYTHING TO SERVER

    const settings = {
      url: "http://139.59.80.139/api/v1/cms/studentAssessments/create",
      data: {
        data: asessmentTemplate.data,
        user: CURRENT_USER
      },

      method: "POST",

      beforeSend: function(xhr) {
        xhr.setRequestHeader(
          "Authorization",
          // "Basic " + btoa(username + ":" + password)
          "Bearer " + localStorage.getItem("token")
        );
        xhr.setRequestHeader(
          "content-type",
          "application/x-www-form-urlencoded"
        );
      }
    };
    $.ajax(settings)
      .done((users, textStatus, request) => {
        swal({
          position: "top-right",
          type: "success",
          title: "User Assesment successfully Updated",
          showConfirmButton: false,
          timer: 1500
        });
        $("#mark-attendance-modal").modal("toggle");
        $(".modal-backdrop").remove();
        // fetchAttendanceData();
        /**
         * doing this as a workaround for image backdrop issue.
         * should find a fix soon
         */
        location.reload();
      })
      .fail(xhr => {
        swal({
          title: "Oops...",
          text: "There seems to be some Error, Please try in sometime.",
          type: "error",
          confirmButtonColor: "#DD6B55"
        });
        $("#mark-attendance-modal").modal("toggle");
        $(".modal-backdrop").remove();
        // fetchAttendanceData();
        location.reload();
      });
  };
});
