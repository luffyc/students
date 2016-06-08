    var arr=[];
	forEach = arr.forEach;
	filter = arr.filter;


    //判断是否有students
	if(localStorage.students){
		var students=JSON.parse(localStorage.students);
	}else{
		var students=[
		    {id:10001,name:'Luffy',sex:'male',age:20,jiguan:'Beijing'},
		    {id:10002,name:'Cheng',sex:'female',age:21,jiguan:'Hongkong'},
		    {id:10003,name:'Adam',sex:'male',age:32,jiguan:'Shanghai'},
		];
		localStorage.setItem('students',JSON.stringify(students));
	}

	//添加信息
	var add=document.querySelector('.add');
    var aa=function(){
    	if(students.length){
    		var xuehao=students[students.length-1].id+1;
    	}else{
    		var xuehao=10001;
    	}
    	var s={id:xuehao,name:'',sex:'',age:'',jiguan:''};
    	students.push(s);
    	localStorage.setItem('students',JSON.stringify(students));
        var tr=document.createElement('tr');
        tr.setAttribute('data-id',s.id);
        tr.innerHTML='<td>'+s.id+'</td><td data-role="name">'+s.name+'</td><td data-role="sex">'+s.sex+'</td><td data-role="age">'+s.age+'</td><td data-role="jiguan">'+s.jiguan+'</td><td><input type="checkbox" class="ck" value="'+s.id+'"></td>'
		tbody.appendChild(tr);
        changeinput(tr);
    }
    add.addEventListener('click',aa);

    //可编辑
    var changeinput=function(tr){
		var tds=tr.querySelectorAll('td[data-role]');
		if(tr.classList.contains('editing')){
			forEach.call(tds,function(v){
				var tmp=v.querySelector('input').value;
		        v.innerHTML=tmp;
			})
			tr.classList.remove('editing');
		}else{
			tr.classList.add('editing');
			forEach.call(tds,function(v){
				var val=v.innerHTML;
		        v.innerHTML='<input type="text" value="'+val+'">';
			})
			tds[0].querySelector('input').focus();
		}
	}

	//渲染函数
	var tbody=document.getElementsByClassName('tbody')[0];
	var render=function(){
		tbody.innerHTML=null;
		students.forEach(function(v){
			var tr=document.createElement('tr');
			tr.setAttribute('data-id',v.id);
			tr.innerHTML='<td>'+v.id+'</td><td data-role="name">'+v.name+'</td><td data-role="sex">'+v.sex+'</td><td data-role="age">'+v.age+'</td><td data-role="jiguan">'+v.jiguan+'</td><td><input type="checkbox" class="ck" value="'+v.id+'"></td>'
			tbody.appendChild(tr);
		})
	}
	render();
	
	//删除事件
	var remove=document.querySelector('.remove');
	var bb=function(){
		var ck=document.querySelectorAll('.ck');
		forEach.call(ck,function(v){
			if(v.checked){
            	tbody.removeChild(v.parentElement.parentElement)
            	deletestudents(v.value);
            }
		})
	}
    remove.addEventListener('click',bb);

	//删除数据函数
	var deletestudents=function(id){
		var id=Number(id);
		students=students.filter(function(v){
			return v.id != id;
		})
		localStorage.setItem('students',JSON.stringify(students));
	}

	//全选反选
	var all=document.querySelector('.all');
    var cc=function(){
        var ck=document.querySelectorAll('.ck');
        var self = this;
        forEach.call(ck,function(v){
        	v.checked=self.checked;
        })
    }
    all.addEventListener('click',cc);

    //事件委派
    var dd=function(e){
    	var el=e.target;
    	if(el.nodeName === 'TD'){
    		var els=tbody.querySelectorAll('.editing');
    		forEach.call(els,function(v){
    			changeinput(v);
    		})
			changeinput(el.parentElement)
	    }else if(el.classList.contains('ck')){
	    	var els=tbody.querySelectorAll('.ck');
	    	var tmp = filter.call(els,function(v){
                return v.checked;
	    	})
	    	if(tmp.length === students.length){
                all.checked=true;
	    	}else{
                all.checked=false;
	    	}
	    }
	}
    tbody.addEventListener('click',dd);
    
    //数据保存更新
	var tips=document.getElementById('tips');
	var updatestudent=function(xuehao,key,value){
		xuehao=parseInt(xuehao);
        students.forEach(function(v){
        	if(v.id === xuehao){
				v[key]=value;
			}
			tips.style.display='block';
			tips.innerHTML='save success';
			setTimeout(function(){
				tips.style.display='none';
			},2000);

			localStorage.students=JSON.stringify(students);
        })
	}

	//按下键盘数据保存
	var timerId;
	var ee=function(e){
		var el=e.target;
		var xuehao=el.parentElement.parentElement.getAttribute('data-id');
		var k=el.parentElement.getAttribute('data-role');
		var v=el.value;
		tips.style.display='block';
		tips.innerHTML='save...';
        //节流的实现
		clearTimeout(timerId);
		timerId=setTimeout(function(){
			updatestudent(xuehao,k,v)
		},800);
	}
	tbody.addEventListener('keyup',ee);

	//点击排序
	var tdes=document.querySelector('.table thead');
	var ff=function(e){
		var el=e.target;
		if(el.nodeName === 'TD'){
            var sortKey=el.getAttribute('data-role');
			var state=(el.getAttribute('flag') === 'true')?true:false;
			el.setAttribute('flag',!state);

			students.sort(function(x,y){
				return state ? ( x[sortKey] > y[sortKey]):( x[sortKey] < y[sortKey]);
			})
			localStorage.students=JSON.stringify(students);
	     render();
		}
	}
	tdes.addEventListener('click',ff);