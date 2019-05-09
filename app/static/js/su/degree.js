jQuery(document).ready(function(){  
  
  var degree = {};

    degree.property = {
        version: "v1.0",
        name: "degree",
        tableId: "degree_hou",
        checkAllClass: "checkall",
        buttonId: "employeeButtonId",
        formId: "employeeForm",
        corporateFormId: "employeeForm",
        returnStatus: "SUCCESS",
        returnTitle: "操作成功",
        statusTitle: "请选择一条数据！",
        idFailure: "获取id失败",
        prompt: "提示",
        pleaseConfirm: "请确认！",
        wantToDelete: "您确定要删除吗?",
        sexMan: "男",
        sexWoman: "女",
        isTest: "是",
        noTest: "否",
        banned: "禁用",
        enable: "启用"
    };

    //初始化配置

    degree.gridInit = {
        searching: true,
        lengthChange: true,
        paging: true,
        scrollCollapse: true,
        serverSide: false,
        search: true,
        processing: true,
        scrollX: "100%",
        scrollXInner: "100%",
        scrollCollapse: true,
        jQueryUI: false,
        autoWidth: true,
        autoSearch: false,
        fnDrawCallback: function(oSettings) {
            jQuery('input:checkbox,input:radio').uniform();
			//jQuery.uniform.update();
      }
    };

    //路径配置

    

    degree.status = [
        {"searchable": false, "orderable": false, "targets": 0},//第一行不进行排序和搜索

        {"targets": [1], "visible": false},    //设置第1列隐藏/显示

        {defaultContent: '', targets: ['_all']} //所有列设置默认值为空字符串

    ];

    degree.filed = [
        {
            "data": "degreeId",
            "createdCell": function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
            }
        },
        {"data": "degreeId"},
        {"data": "degreeNameCH"},
        {"data": "degreeType"},
        {"data": "author"},
        {"data": "firsttutor"},
        {"data": "secondtutor"},
        {"data": "graduationUnit"},
        {"data": "graduationTime"}
    ];
    
    var eloancn = {};

    eloancn.table = {
        grid: "",
        statusTitle: "请选择一条数据！"
    };
    
    //dataTables方法封装

    function dataTablesInit(elo) {

        eloancn.table.grid = $('#' + elo.property.tableId).DataTable({
            
            "searching": elo.gridInit.searching,//搜索框，默认是开启

            "lengthChange": elo.gridInit.lengthChange,//是否允许用户改变表格每页显示的记录数，默认是开启

            "paging": elo.gridInit.paging,//是否开启本地分页，默认是开启

            "processing": elo.gridInit.processing,//是否显示中文提示

            "scrollCollapse": elo.gridInit.scrollCollapse,  //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变

            "serverSide": elo.gridInit.serverSide, //开启服务器模式，默认是关闭

            "scrollY": elo.gridInit.scrollY,//设置高

            "scrollX": elo.gridInit.scrollX,//设置宽度

            "scrollXInner": elo.gridInit.scrollXInner,//设置内宽度

            "scrollCollapse": elo.gridInit.scrollCollapse,//设置折叠

            "jQueryUI": elo.gridInit.jQueryUI,//jquery 风格

            "autoWidth": elo.gridInit.autoWidth, //是否自适应宽度

            "columns": elo.filed,//字段

            "columnDefs": elo.status,//列表状态
            
			"fnDrawCallback": function(oSettings) {
	            jQuery('input:checkbox,input:radio').uniform();
      		},
            "language": {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "未搜索到数据",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            },
            "dom": "<'row'<'col-sm-2'l><'#" + elo.property.buttonId + ".col-sm'><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
            "initComplete": function () {
                $("#" + elo.property.buttonId).append("<span id='choo' >已选0项</span>");
                
                //加载完成之后 初始化checkbox

                checkbox(elo.property.tableId);


                //checkbox全选

                 $("." + elo.property.checkAllClass).click(function () {
                    if ($(this).prop("checked")) {
                    	$("input[name='checkList']").prop("checked", true);
                        $("input[name='checkList']").parent().addClass('checked');	
                        $("tr").addClass('selected');
                    } else {
                    	$("input[name='checkList']").prop("checked", false);
                        $("input[name='checkList']").parent().removeClass('checked');
                        $("tr").removeClass('selected');
                    }
                    checkIndex();
                });

            }
        });

        //错误信息提示

        $.fn.dataTable.ext.errMode = function (s, h, m) {
            if (h == 1) {
                alert("连接服务器失败！");
            } else if (h == 7) {
                alert("返回数据错误！");
            }
        };

        //回调，如果返回的时候有问题提示信息

        eloancn.table.grid.on('xhr.dt', function (e, settings, json, xhr) {
            console.log("重新加载了数据");
            console.log(json);
        });
    }

    //选中一行 checkbox选中
	
    function checkbox(tableId) {
        //每次加载时都先清理
        $('#' + tableId + ' tbody').off("click", "tr");
        $('#' + tableId + ' tbody').on("click", "tr", function () {
            $(this).toggleClass('selected');
            if ($(this).hasClass("selected")) {
                $(this).find("input").prop("checked", true);
            } else {
                $(this).find("input").prop("checked", false);
            }
            checkIndex();
        })
       
    };
	
	function checkIndex(){
		var uuids = eloancn.table.grid.rows(".selected").data();
        var	length=uuids.length;
        $('#choo').eq(0).text("已选"+length+"项");
	}
	
	jQuery('.deletebutton').click(function(){
	var allarr=getdata();
	if(allarr.length){
		var con= confirm('确定删除吗?');
		if(con){
		 $.ajax({
                    url: "/su/del", //删除处理链接
                   data:{
                      allarr:allarr,
                      },
                      dataType: "json",
                      type:"POST",
                      success: function(data){
                          alert("修改成功！");
                          location.reload();
                        },
                      error:function(){
                          alert("修改失败！");
                     
                      },
                      complete:function(data){
                      }
			 }); 
		}
	}else alert('请选择数据');								//alert to 请选择数据
	});
	
	jQuery('.detailbutton_su').click(function(){
	var allarr=getdata();
	if(allarr.length==1){
		$.ajax({
                   url: "/stu/info", 
                   data:{
                      allarr:allarr,
                      },
                      dataType: "json",
                      type:"POST",
                      success: function(data){
                        msg = data.type
                        if (msg== '学位论文'){
                          window.open("/su/deg_info","_self")
                        }
                       },
                      error:function(){
						window.open("/404","_self");
                      }
            })
	}else alert('请选择一条数据');	
	});
$('a[rel*=leanModal]').leanModal({ top : 200, closeButton: ".modal_close" });
$("#btnImportOK").click(function () {
  
              var formData = new FormData($("#uploadForm")[0]);
              $.ajax({
                  type: "POST",
                  data: formData,
                  url: "/up_file",
                  contentType: false,
                  processData: false,
                  success:function (returndata) {
					alert(returndata) 
　　				  }, 
　　				  error: function (returndata) { 
　　　　　			alert("上传失败！")
                  }
　　					})
  
          });	
	jQuery('.exportbutton_execl').click(function(){
		var pattern=jQuery('.pattern').val()// get target id of table	
		var allarr=getdata();
		if(allarr.length){
		console.log(allarr);console.log(pattern);
		 $.ajax({
	   			   url: "/xlsdownload_degree",
				   data:{
				      allarr:allarr,
				      
				      },
				      dataType: "text",
				      type:"POST",
				      success: function(){
				      	window.open("/xlsdownload02");
                        },
				      error:function(){
				        console.log("异常");
				      }
			 }); 
	}
		else alert('请选择数据');								//alert to 请选择数据
	});
	jQuery('.exportbutton_txt').click(function(){
		var pattern=jQuery('.pattern').val();
		var allarr=getdata();
		if(allarr.length){
		console.log(allarr);console.log(pattern);
		 $.ajax({
	   			   url: "/txtdownload02",
				   data:{
				      allarr:allarr,
				      },
				      dataType: "text",
				      type:"POST",
				      success: function(){
				      	window.open("/txtdownload");
				      	},
				      error:function(){
				        console.log("异常");
				      }
			 }); 
	}
		else alert('请选择数据');								//alert to 请选择数据
	});
	function getdata(){
		var uuids = eloancn.table.grid.rows(".selected").data();
		var allarr=[];
		if(uuids.length){
			for(var i=0;i<uuids.length;i++){
				allarr.push(setObject(uuids[i].degreeId,uuids[i].type));
			}
		}
		return allarr;
	};
    function setObject(id,type) {
    var all = new Object();
    all.id = id;
    all.type = '学位论文';
    return all;
    
}
   
     $(document).ready(function(){
           dataTablesInit(degree);
     });
    
jQuery('input:checkbox,input:radio').uniform();

});