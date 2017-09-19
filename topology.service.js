/**
 * Copyright 2015 EasyStack Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
(function () {
    'use strict';

    angular
        .module('horizon.openstack-service-api')
        .service('horizon.openstack-service-api.drawtopology', DrawTopology);
    DrawTopology.$inject = ['createhostDetailAction', 'hostLoginAction', 'hostRebootAction', 'switchDetailAction', 'switchLoginAction', 'lenovoTrafficsAction'];
    function DrawTopology(createhostDetailAction, hostLoginAction, hostRebootAction, switchDetailAction, switchLoginAction, lenovoTrafficsAction) {
        this.drawPhysicaltopology = function (data) {
	
	var storage = window.localStorage;
	if (data.origin_switch_link_list.length != 0){
	    //storage.setItem('data', data);
	}
        var load_data = storage.getItem('data');

	function handler(event, switch_details){
            var div = document.getElementById("bl_1");
            var movey = 10 + 85;
            div.style.top = movey + "px";
            div.style.left = move + 45 - 100 + "px";
            var bl = document.getElementById("tb")
                var x = bl.createCaption();
            for (var i = bl.rows.length - 1; i >= 0; i--) {
                bl.deleteRow(i);
            }
            var row = bl.insertRow(bl.rows.length);
            var row1 = bl.insertRow(bl.rows.length);
            var row2 = bl.insertRow(bl.rows.length);
            var cell1 = row.insertCell(row.cells.length);
            var cell2 = row.insertCell(row.cells.length);
            var cell3 = row1.insertCell(row1.cells.length);
            var cell4 = row1.insertCell(row1.cells.length);
            var cell5 = row2.insertCell(row2.cells.length);
            var cell6 = row2.insertCell(row2.cells.length);
            x.innerHTML = switch_details["sysname"];;
            cell1.innerHTML = gettext("ip:");
            cell2.innerHTML = switch_details["ip"];
            cell3.innerHTML = gettext("chassisid:");
            cell4.innerHTML = switch_details["chassisid"]; 
            cell5.innerHTML = gettext("sysname:");
            cell6.innerHTML = switch_details["sysname"]; 
            document.getElementById("m_title").innerHTML = gettext("manage the switch");
            document.getElementById("link").innerHTML = "»" + gettext("view switch details");
            document.getElementById("login").innerHTML = gettext("login the switch");
            document.getElementById("login").style.width = "115px";
            document.getElementById("shut").style.display = "none";
            document.getElementById("restart").style.display = "none";

            var switch_id_fordetails = switch_details["oid"];
            var switch_login = switch_details["id"];
            document.getElementById("link").onclick = function () {
                (new switchDetailAction()).open(switch_details['ip'], switch_id_fordetails);
            }
            document.getElementById("login").onclick = function () {
                (new switchLoginAction()).open([{'id': switch_login}]);
            }

            $("#bl_1").css({
                top: event.offsetTop,
                left: event.offsetLeft
            }).show();
        }

        function popup_mouseover(node, details){
            node.mouseover(function(event){
                handler(event, details);
            });
            node.mouseout(function(event){
                $("#bl_1").hide();
            });
        }

        function popup_mouseclick(node){
            node.click(function(event){
                handler(event);
            });
            node.mouseout(function(event){
                $("#hoverBox").hide();
            });
        }

        var LINKLINE_NAME_TO = "linkline_top";
        var LINKLINE_NAME_FROM = "linkline_bottom";
        function get_container_child_to(container){
            for (var child in container.childs){
                if (container.childs[child].text == LINKLINE_NAME_TO)
                    return container.childs[child];
            }

            return null;
        }

        function get_container_child_from(container){
            for (var child in container.childs){
                if (container.childs[child].text == LINKLINE_NAME_FROM)
                    return container.childs[child];
            }

            return null;
        }

        function draw_rack_lamplet(scene, container, conf){
            var text_node = new JTopo.Node();
            text_node.fillColor = conf.fillcolor;
            text_node.setBound(conf.x, conf.y, conf.w, conf.h);   
            //text_node.borderRadius = 8;
            text_node.dragable = 0;
            text_node.alpha = 1;
            text_node.visible = 1;
            text_node.zIndex = 94;

            scene.add(text_node);
            container.add(text_node);
        }


        function create_rack_outer_ring(scene, name, count, conf){
            var container_obj = new JTopo.Container();
            container_obj.layout = JTopo.layout.GridLayout(0, 1);
            container_obj.alpha = 1;
            container_obj.text = name;
            container_obj.font = "13px bold Consolas";
            container_obj.fontColor = "0,0,0";
            container_obj.fillColor = "234,232,232";

            container_obj.setBound(conf.x, conf.y, conf.w, conf.h);   
            container_obj.borderRadius = 0;					
            container_obj.borderWidth= 2;
            container_obj.borderColor= "142,157,173";
            container_obj.zIndex = 18;					
            container_obj.childDragble = 0;					
            container_obj.showSelected = 0;					
            //container_obj.shadow= 1;					
            scene.add(container_obj);			

            return container_obj;
        }

        function create_dummy_rack_server(scene, container_rack, conf){
            //create the server
            var container_server = new JTopo.Container();
            container_server.layout = JTopo.layout.GridLayout(0, 4);
            container_server.alpha = 0;
            container_server.visible = 0;
            container_server.textPosition = "Middle_Left";
            container_server.textOffsetY = -9;
            container_server.font = "1px Consolas";
            container_server.fontColor = "0,0,0";
            container_server.fillColor = "188,211,229";
            container_server.borderWidth= conf.borderwidth;
            container_server.borderColor= conf.bordercolor;
            container_server.showSelected = false;					
            container_server.zIndex = 19;
            //container_server.shadow = 1;
            container_server.setBound(conf.x, conf.y, conf.w, conf.h);

            scene.add(container_server);
            container_rack.add(container_server);

            //create connect line node 
            var text_node = new JTopo.Node(LINKLINE_NAME_TO);
            text_node.textPosition = "Middle_Center";
            text_node.textOffsetY = 0;
            text_node.font = "1px bold Consolas";
            text_node.fillColor = "143,188,143";
            text_node.setBound(conf.x, conf.y, conf.w, 45);   
            text_node.borderRadius = 8;
            text_node.borderWidth= 2;
            text_node.dragable = 0;
            text_node.alpha = 0;
            text_node.visible = 0;
            text_node.zIndex = 11;

            scene.add(text_node);
            container_rack.add(text_node);

            return container_server;
        }



        function create_rack_server(scene, container_rack, name, chassisid, server_details, conf){
            //create the server
            var container_server = new JTopo.Container();
            container_server.layout = JTopo.layout.GridLayout(0, 4);
            container_server.alpha = 1;
            container_server.text = name;
            container_server.textPosition = "Middle_Left";
            container_server.textOffsetY = 0;
            container_server.font = "1px Consolas";
            container_server.fontColor = "0,0,0";
            container_server.fillColor = "188,211,229";
            container_server.borderWidth= conf.borderwidth;
            container_server.borderColor= conf.bordercolor;
            container_server.showSelected = false;					
            container_server.zIndex = 19;
            //container_server.scaleX = -2;
            //container_server.shadow = 1;
            
            container_server.setBound(conf.x, conf.y, conf.w, conf.h);


            popup_mouseover(container_server, server_details);

            scene.add(container_server);
            container_rack.add(container_server);

            //create connect line node 
            var text_node = new JTopo.Node(LINKLINE_NAME_TO);
            text_node.textPosition = "Middle_Center";
            text_node.textOffsetY = 0;
            text_node.font = "1px bold Consolas";
            text_node.fillColor = "143,188,143";
            text_node.setBound(conf.x, conf.y, conf.w, 45);   
            text_node.borderRadius = 8;
            text_node.borderWidth= 2;
            text_node.dragable = 0;
            text_node.alpha = 1;
            text_node.visible = 0;
            text_node.zIndex = 11;

            scene.add(text_node);
            container_rack.add(text_node);

            return container_server;
        }

        function RndNum(n) {
            var rnd = "";
            for (var i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
            return rnd;
        }

        function server(cxt, container_rack, x, y, name, chassisid, server_details) {
            var str = RndNum(8);
            var names, container_server;
            if (name.length > 7) {
                names = name.substring(0, 5) + "...";
            } else {
                names = name;
            }


            if (server_details["status"] == 1) {
                var conf={'x':x,
                    'y':y + 4,
                    'w':85,
                    'h':28,
                    'borderwidth':3,
                    'bordercolor': "170,193,214"
                };
                container_server = create_rack_server(scene, container_rack, names, chassisid, server_details, conf);
            }
            if (server_details["status"] == 3) {
                var conf={'x':x,
                    'y':y + 4,
                    'w':85,
                    'h':28,
                    'borderwidth':1,
                    'bordercolor': "142,170,193"
                };
                container_server = create_rack_server(scene, container_rack, names, chassisid, server_details, conf);

            }

            /*
               var hoet_id_fordetail = server_details['oid'];
               server.click(function () {
               (new createhostDetailAction()).open(hoet_id_fordetail);
               });
               var names;
               if (name.length > 7) {
               names = name.substring(0, 5) + "...";
               } else {
               names = name;
               }

               var text = cxt.text(x + 23, y + 15 + 4, names).attr({
               "fill": "#000",
               "font-size": "10px"
               });
               text.click(function () {
               (new createhostDetailAction()).open(hoet_id_fordetail);

               });
               var move = x;

               server.hover(function () {
               timer = setTimeout(function () {
               document.getElementById("bl_1").style.display = "block";
               document.getElementById("table").style.display = "block";
               document.getElementById("foot").style.display = "block";
               document.getElementById("tBody").style.display = "block";
               var bl = document.getElementById("tb");
               var x = bl.createCaption();
               var tBody = document.getElementById("tBody");
               var x2 = document.getElementById("m_title");

               for (var i = bl.rows.length - 1; i >= 0; i--) {
               bl.deleteRow(i);
               }
               ;
               for (var i = tBody.rows.length - 1; i >= 0; i--) {
               tBody.deleteRow(i);
               }

               var row = bl.insertRow(bl.rows.length);
               var row1 = bl.insertRow(bl.rows.length);
               var row2 = bl.insertRow(bl.rows.length);
               var cell1 = row.insertCell(row.cells.length);
               var cell2 = row.insertCell(row.cells.length);
               var cell3 = row1.insertCell(row1.cells.length);
               var cell4 = row1.insertCell(row1.cells.length);
               var cell5 = row2.insertCell(row2.cells.length);
               var cell6 = row2.insertCell(row2.cells.length);

               x.innerHTML = server_details["sysname"];
               cell1.innerHTML = "&nbsp&nbsp" + gettext("ip:");
               cell2.innerHTML = server_details["ip"];
               cell3.innerHTML = "&nbsp&nbsp" + gettext("chassisid:");
               cell4.innerHTML = server_details["chassisid"];
               cell5.innerHTML = "&nbsp&nbsp" + gettext("sysname:");
               cell6.innerHTML = server_details["sysname"];

            //document.getElementById("m_title").innerHTML = gettext("manage the server");
            var row21 = tBody.insertRow(tBody.rows.length);

            var cell21 = row21.insertCell(row21.cells.length);
            var cell22 = row21.insertCell(row21.cells.length);
            var cell23 = row21.insertCell(row21.cells.length);
            var cell24 = row21.insertCell(row21.cells.length);
            var cell25 = row21.insertCell(row21.cells.length);
            var cell26 = row21.insertCell(row21.cells.length);
            x2.innerHTML = gettext("manage the server");

            cell21.innerHTML = "&nbsp&nbsp" + gettext("server") + gettext("port");
            //cell22.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +  gettext("traffic status") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
            cell23.innerHTML = gettext("Switch Name") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
            cell24.innerHTML = "&nbsp&nbsp" + gettext("switch port") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
            //cell25.innerHTML = "&nbsp&nbsp" +  gettext("traffic details") + "&nbsp&nbsp&nbsp&nbsp";
            cell26.innerHTML = "&nbsp&nbsp" + gettext("link status") + "&nbsp&nbsp&nbsp&nbsp";

            for (var cd = 0; cd < server_details['active_port_details'].length; cd++) {
                for (var j = 0; j < switch_list.length; j++) {
                    if (server_details["active_port_details"][cd]["remchassisid"] == switch_list[j]["chassisid"]) {
                        var row22 = tBody.insertRow(tBody.rows.length);
                        var cell31 = row22.insertCell(row22.cells.length);
                        var cell32 = row22.insertCell(row22.cells.length);
                        var cell33 = row22.insertCell(row22.cells.length);
                        var cell34 = row22.insertCell(row22.cells.length);
                        var cell35 = row22.insertCell(row22.cells.length);
                        var cell36 = row22.insertCell(row22.cells.length);
                        cell31.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + server_details['active_port_details'][cd]["eth_name"];
                        cell33.innerHTML = server_details['active_port_details'][cd]["remsysname"];
                        if (server_details['status'] == "1" || server_details['status'] == 1) {
                            cell36.innerHTML = "&nbsp&nbsp" + "active";
                        }
                        if (server_details['status'] == "3" || server_details['status'] == 3) {
                            cell36.innerHTML = "&nbsp&nbsp" + "offline";
                        }
                        for (var k = 0; k < origin_switch_link_list.length; k++) {
                            if (switch_list[j]["ip"] == origin_switch_link_list[k]["switch_ip"]) {
                                for (var z = 0; z < origin_switch_link_list[k]["link_details"].length; z++) {
                                    if (server_details["chassisid"] == origin_switch_link_list[k]["link_details"][z]["remchassisid"] && origin_switch_link_list[k]["link_details"][z]["remportiddesc"] == server_details["active_port_details"][cd]["eth_name"]) {
                                        //cell32.innerHTML = "&nbsp&nbsp" + '<div class="portStatus"style="border-right:90px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';border-bottom:2px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';margin-bottom:10px;"></div>';

                                        var portindex = origin_switch_link_list[k]["link_details"][z]["locportindex"];
                                        if (origin_switch_link_list[k]["link_details"][z]["color"] == "#5E5E5E") {
                                            //cell35.innerHTML = "&nbsp&nbsp&nbsp" + gettext("no details");
                                        } else {
                                            var inputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|input|" + portindex + "/detail/";
                                            var outputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|output|" + portindex + "/detail/";
                                            var inTrafficData = {
                                                queryType: 'realtime',
                                                ip: switch_list[j]["ip"],
                                                locportindex: portindex
                                            };
                                            //cell35.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                                            cell35.onclick = function (event) {
                                                event = event || window.event;
                                                var ele = event.target;
                                                if ($(ele).attr('class') == 'traficinputDetail') {
                                                    inTrafficData.direction = 'input';
                                                    (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                                    inTrafficData.direction = 'output';
                                                    (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                }
                                            };
                                        }
                                    }
                                    for (var p = 0; p < origin_switch_link_list.length; p++) {
                                        if (switch_list[j]["ip"] == origin_switch_link_list[p]["switch_ip"]) {
                                            for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {
                                                if (origin_switch_link_list[p]["link_details"][q]["remchassisid"] == server_details["chassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == server_details['active_port_details'][cd]["eth_name"]) {
                                                    cell34.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + origin_switch_link_list[p]["link_details"][q]["locportid"] + "&nbsp&nbsp&nbsp&nbsp&nbsp";

                                                }
                                            }
                                        }
                                    }
                                    ;
                                }
                            }
                        }

                    }

                }

            }
            document.getElementById("link").innerHTML = "»" + gettext("view server details");
            document.getElementById("restart").style.display = "block";
            document.getElementById("restart").style.width = "50px";
            document.getElementById("restart").style.height = "30px";
            document.getElementById("restart").innerHTML = gettext("reboot");
            document.getElementById("login").style.width = "40px";
            document.getElementById("login").style.height = "30px";
            document.getElementById("login").style.display = "block";
            document.getElementById("shut").style.display = "none";
            document.getElementById("login").innerHTML = gettext("login");
            var div = document.getElementById("bl_1");
            var movey = y + 40;
            div.style.top = movey + "px";
            //div.style.left = move + "px";
            div.style.left = move + 50 - 100 + "px";
            var str = RndNum(8);


            //document.getElementById("link").href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/detail/";
            var hoet_id_fordetail = server_details["oid"];
            var hoet_id_forlogin = server_details["id"];
            document.getElementById("link").onclick = function () {
                (new createhostDetailAction()).open(hoet_id_fordetail);
            }
            document.getElementById("login").onclick = function () {
                (new hostLoginAction()).open([{'id': hoet_id_forlogin}]);
            }
            document.getElementById("shut").onclick = function () {
                window.location.href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/shutdownhost/";
            }
            document.getElementById("restart").onclick = function () {
                (new hostRebootAction()).open([{'id': hoet_id_forlogin}]);
            }

        },
            nodetime);
        },
        function () { // modified 2000 to 1000  by lyj 2016/8/29
            clearTimeout(timer);

        })

        text.hover(function (e) {
            timer = setTimeout(function () {

                document.getElementById("bl_1").style.display = "block";
                document.getElementById("table").style.display = "block";
                document.getElementById("foot").style.display = "block";
                document.getElementById("tBody").style.display = "block";
                var bl = document.getElementById("tb");
                var x = bl.createCaption();
                var tBody = document.getElementById("tBody");
                var x2 = document.getElementById("m_title");

                for (var i = bl.rows.length - 1; i >= 0; i--) {
                    bl.deleteRow(i);
                }
                for (var i = tBody.rows.length - 1; i >= 0; i--) {
                    tBody.deleteRow(i);
                }
                var row = bl.insertRow(bl.rows.length);
                var row1 = bl.insertRow(bl.rows.length);
                var row2 = bl.insertRow(bl.rows.length);
                var cell1 = row.insertCell(row.cells.length);
                var cell2 = row.insertCell(row.cells.length);
                var cell3 = row1.insertCell(row1.cells.length);
                var cell4 = row1.insertCell(row1.cells.length);
                var cell5 = row2.insertCell(row2.cells.length);
                var cell6 = row2.insertCell(row2.cells.length);

                x.innerHTML = server_details["sysname"];
                cell1.innerHTML = gettext("ip:");
                cell2.innerHTML = server_details["ip"];
                cell3.innerHTML = gettext("chassisid:");
                cell4.innerHTML = server_details["chassisid"];
                cell5.innerHTML = gettext("sysname:");
                cell6.innerHTML = server_details["sysname"];

                var row21 = tBody.insertRow(tBody.rows.length);

                var cell21 = row21.insertCell(row21.cells.length);
                var cell22 = row21.insertCell(row21.cells.length);
                var cell23 = row21.insertCell(row21.cells.length);
                var cell24 = row21.insertCell(row21.cells.length);
                var cell25 = row21.insertCell(row21.cells.length);
                var cell26 = row21.insertCell(row21.cells.length);
                x2.innerHTML = gettext("manage the server");

                cell21.innerHTML = "&nbsp&nbsp" + gettext("server") + gettext("port");
                //cell22.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +  gettext("traffic status") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                cell23.innerHTML = gettext("Switch Name") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                cell24.innerHTML = "&nbsp&nbsp" + gettext("switch port") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                //cell25.innerHTML = "&nbsp&nbsp" +  gettext("traffic details") + "&nbsp&nbsp&nbsp&nbsp";
                cell26.innerHTML = "&nbsp&nbsp" + gettext("link status") + "&nbsp&nbsp&nbsp&nbsp";

                for (var cd = 0; cd < server_details['active_port_details'].length; cd++) {
                    for (var j = 0; j < switch_list.length; j++) {
                        if (server_details["active_port_details"][cd]["remchassisid"] == switch_list[j]["chassisid"]) {
                            var row22 = tBody.insertRow(tBody.rows.length);
                            var cell31 = row22.insertCell(row22.cells.length);
                            var cell32 = row22.insertCell(row22.cells.length);
                            var cell33 = row22.insertCell(row22.cells.length);
                            var cell34 = row22.insertCell(row22.cells.length);
                            var cell35 = row22.insertCell(row22.cells.length);
                            var cell36 = row22.insertCell(row22.cells.length);
                            cell31.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + server_details['active_port_details'][cd]["eth_name"];
                            cell33.innerHTML = server_details['active_port_details'][cd]["remsysname"];
                            if (server_details['status'] == "1" || server_details['status'] == 1) {
                                cell36.innerHTML = "&nbsp&nbsp" + "active";
                            }
                            if (server_details['status'] == "3" || server_details['status'] == 3) {
                                cell36.innerHTML = "&nbsp&nbsp" + "offline";
                            }
                            for (var k = 0; k < origin_switch_link_list.length; k++) {
                                if (switch_list[j]["ip"] == origin_switch_link_list[k]["switch_ip"]) {
                                    for (var z = 0; z < origin_switch_link_list[k]["link_details"].length; z++) {
                                        if (server_details["chassisid"] == origin_switch_link_list[k]["link_details"][z]["remchassisid"] && origin_switch_link_list[k]["link_details"][z]["remportiddesc"] == server_details["active_port_details"][cd]["eth_name"]) {
                                            //cell32.innerHTML = "&nbsp&nbsp" + '<div class="portStatus"style="border-right:90px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';border-bottom:2px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';margin-bottom:10px;"></div>';

                                            var portindex = origin_switch_link_list[k]["link_details"][z]["locportindex"];
                                            if (origin_switch_link_list[k]["link_details"][z]["color"] == "#5E5E5E") {
                                                //cell35.innerHTML = "&nbsp&nbsp&nbsp" + gettext("no details");
                                            } else {
                                                var inputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|input|" + portindex + "/detail/";
                                                var outputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|output|" + portindex + "/detail/";
                                                var inTrafficData = {
                                                    queryType: 'realtime',
                                                    ip: switch_list[j]["ip"],
                                                    locportindex: portindex
                                                };
                                                //cell35.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                                                cell35.onclick = function (event) {
                                                    event = event || window.event;
                                                    var ele = event.target;
                                                    if ($(ele).attr('class') == 'traficinputDetail') {
                                                        inTrafficData.direction = 'input';
                                                        (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                    } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                                        inTrafficData.direction = 'output';
                                                        (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                    }
                                                };
                                            }
                                        }
                                        for (var p = 0; p < origin_switch_link_list.length; p++) {
                                            if (switch_list[j]["ip"] == origin_switch_link_list[p]["switch_ip"]) {
                                                for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {
                                                    if (origin_switch_link_list[p]["link_details"][q]["remchassisid"] == server_details["chassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == server_details['active_port_details'][cd]["eth_name"]) {
                                                        cell34.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + origin_switch_link_list[p]["link_details"][q]["locportid"] + "&nbsp&nbsp&nbsp&nbsp&nbsp";

                                                    }
                                                }
                                            }
                                        }
                                        ;
                                    }
                                }
                            }

                        }

                    }

                }

                //document.getElementById("m_title").innerHTML = gettext("manage the server");


                document.getElementById("link").innerHTML = "»" + gettext("view server details");
                document.getElementById("restart").style.display = "block";
                document.getElementById("restart").style.width = "50px";
                document.getElementById("restart").style.height = "30px";
                document.getElementById("restart").innerHTML = gettext("reboot");
                document.getElementById("login").style.width = "40px";
                document.getElementById("login").style.height = "30px";
                document.getElementById("login").style.display = "block";
                document.getElementById("shut").style.display = "none";
                document.getElementById("login").innerHTML = gettext("login");
                var div = document.getElementById("bl_1");
                var movey = y + 35;
                div.style.top = movey + "px";
                //div.style.left = move -5 + "px";
                div.style.left = move + 45 - 100 + "px";
                var str = RndNum(8);
                //document.getElementById("link").href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/detail/";
                var hoet_id_fordetail = server_details["oid"];
                var hoet_id_forlogin = server_details["id"];
                document.getElementById("link").onclick = function () {
                    (new createhostDetailAction()).open(hoet_id_fordetail);
                }
                document.getElementById("login").onclick = function () {
                    (new hostLoginAction()).open([{'id': hoet_id_forlogin}]);
                }
                document.getElementById("shut").onclick = function () {
                    window.location.href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/shutdownhost/";
                }
                document.getElementById("restart").onclick = function () {
                    (new hostRebootAction()).open([{'id': hoet_id_forlogin}]);
                }

            },
            nodetime);
        },
            function () { // modified 2000 to 1000  by lyj 2016/8/29
                clearTimeout(timer);

            })

        */

            var portlist = [];
        var c = 0;
        for (var i = 0; i < server_details["active_port_details"].length; i++) {
            if (server_details["active_port_details"][i]["eth_name"].substring(0, 3) == "eth") {
                var port = parseInt(server_details["active_port_details"][i]["eth_name"].substring(3, 4));

            } else {

                var port = c;
                c++;
            }

            portlist.push(port);
            for (var j = 0; j < switch_list.length; j++) {

                if (server_details["active_port_details"][i]["remchassisid"] == switch_list[j]["chassisid"]) {

                    for (var p = 0; p < origin_switch_link_list.length; p++) {
                        if (switch_list[j]["ip"] == origin_switch_link_list[p]["switch_ip"]) {
                            for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {

                                if (server_details["chassisid"] == origin_switch_link_list[p]["link_details"][q]["remchassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == server_details["active_port_details"][i]["eth_name"]) {

                                    if (port < 4) {
                                        /*
                                           cxt.rect(x + 50 + (port * 6) + 1, y + 5 + 4, 4, 4).attr({
                                           "fill": origin_switch_link_list[p]["link_details"][q]["color"],
                                           "stroke": "white",
                                           "stroke-width": 0
                                           });
                                           */

                                        var conf = {'x':(x + 50 + (port * 6) + 1),
                                            'y': (y + 5 + 4),
                                            'w': 4,
                                            'h': 4,
                                            'fillcolor': origin_switch_link_list[p]["link_details"][q]["color"]
                                        }; 
                                        //create the server's lamplet
                                        draw_rack_lamplet(scene, container_server, conf);

                                    } else {
                                        /*
                                           cxt.rect(x + 50 + ((port - 4) * 6) + 1, y + 10 + 9 + 4, 4, 4).attr({
                                           "fill": origin_switch_link_list[p]["link_details"][q]["color"],
                                           "stroke": "white",
                                           "stroke-width": 0
                                           });
                                           */

                                        var conf = {'x':(x + 50 + ((port - 4) * 6) + 1),
                                            'y': (y + 10 + 9 + 4),
                                            'w': 4,
                                            'h': 4,
                                            'fillcolor': origin_switch_link_list[p]["link_details"][q]["color"]
                                        }; 
                                        //create the server's lamplet
                                        draw_rack_lamplet(scene, container_server,  conf);
                                    }

                                }
                            }
                        }
                    }
                }
            }

        }
        for (var m = 0; m < 4; m++) {
            var id = 0;
            for (var t = 0; t < portlist.length; t++) {
                if (m == portlist[t]) {
                    id = 1;
                }

            }
            if (id == 0) {
                /*
                   cxt.rect(x + 50 + (m * 6) + 1, y + 5 + 4, 4, 4).attr({
                   "fill": "#8B8989",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   cxt.rect(x + 50, y + 10 + 3 + 4, 26, 2).attr({
                   "fill": "#121217",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   */
                var conf = {'x': (x + 50 + (m * 6) + 1),
                    'y': y + 5 + 4,
                    'w': 4,
                    'h': 4,
                    'fillcolor': "139,137,137"  
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);

                var conf = {'x': x + 50,
                    'y': y + 10 + 3 + 4,
                    'w': 26,
                    'h': 2,
                    'fillcolor': "18,18,23" 
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);

            }
        }

        for (var m = 0; m < 4; m++) {
            var id = 0;
            for (var t = 0; t < portlist.length; t++) {
                if (m == portlist[t] - 4) {
                    id = 1;
                }

            }

            if (id == 0) {
                /*
                   cxt.rect(x + 50 + (m * 6) + 1, y + 10 + 9 + 4, 4, 4).attr({
                   "fill": "#8B8989",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   cxt.rect(x + 50, y + 10 + 3 + 4, 26, 2).attr({
                   "fill": "#121217",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   */

                var conf = {'x': (x + 50 + (m * 6) + 1),
                    'y': (y + 10 + 9 + 4),
                    'w': 4,
                    'h': 4,
                    'fillcolor': "139,137,137" 
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);

                var conf = {'x': (x + 50),
                    'y': (y + 10 + 3 + 4),
                    'w': 26,
                    'h': 2,
                    'fillcolor': "18,18,23"  
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);
            }
        }

        }


        function create_rack(scene, actual_count, x, y, serverlist, tuplelist){
            var container_rack = null;
            var rack_h = 442;

            var count = MAX_SERVER_RACK; 
            if (count % 10 == 0) {

                var conf = {'x': x, 
                    'y': y, 
                    'w': (98 * (parseInt(count / 10))),  
                    'h': rack_h 
                };

                container_rack = create_rack_outer_ring(scene, gettext("logical rack") + rackcount, count, conf);

            } else {
                if (count < 10) {

                    var conf = {'x':x, 
                        'y': y, 
                        'w': (100 * (parseInt(count / 10) + 1)),  
                        'h': rack_h  
                    };

                    container_rack = create_rack_outer_ring(scene, gettext("logical rack") + rackcount, count, conf);

                } else {

                    var conf = {'x':x, 
                        'y': y, 
                        'w': (98 * (parseInt(count / 10) + 1)),  
                        'h': rack_h 
                    };

                    container_rack = create_rack_outer_ring(scene, gettext("logical rack") + rackcount, count, conf);
                }

            }

            if (count % 12 == 0) {
                for (var k = 0; k < count; k++) {
                    if (k >= actual_count){
                        var conf={'x': (x + 8),
                            'y': (y + k * 40 + 2),
                            'w': 85,
                            'h': 28,
                            'borderwidth':3,
                            'bordercolor': "142,170,193"
                        };
                        create_dummy_rack_server(scene, container_rack, conf);
                    } 
                    else
                        server(scene, container_rack, x + 8, y + k * 40 + 2, serverlist[count]["sysname"].substring(0, 8), serverlist[count]["chassisid"], serverlist[count]);
                }
            } 
            else {
                for (var t = 0; t <= parseInt(count / 10) - 1; t++) {
                    for (var i = 0; i < 10; i++) {
                        if ((10 * t + i) >= actual_count){
                            var conf={'x': (x + 8 + 95 * t),
                                'y': (y + i * 40 + 2),
                                'w': 85,
                                'h': 28,
                                'borderwidth':3,
                                'bordercolor': "142,170,193"
                            };
                            create_dummy_rack_server(scene, container_rack, conf);
                        }
                        else
                            server(scene, container_rack, x + 8 + 95 * t, y + i * 40 + 2, serverlist[10 * t + i]["sysname"].substring(0, 8), serverlist[10 * t + i]["chassisid"], serverlist[10 * t + i]);
                    }
                }
                for (var j = 0; j < count % 10; j++) {
                    if ((10 * t + j) >= actual_count){

                        var conf={'x': (x + 8 + 95 * parseInt(count / 10)),
                            'y': (y + j * 40 + 2),
                            'w': 85,
                            'h': 28,
                            'borderwidth':3,
                            'bordercolor': "142,170,193"
                        };
                        create_dummy_rack_server(scene, container_rack, conf);
                    }

                    else
                        server(scene, container_rack, x + 8 + 95 * parseInt(count / 10), y + j * 40 + 2, serverlist[10 * t + j]["sysname"].substring(0, 8), serverlist[10 * t + j]["chassisid"], serverlist[10 * t + j]);

                }
            }
            rackcount = rackcount + 1;

            return container_rack;

        }



        function create_container_sw(scene, switch_details, x, y, w, h, floor1_number, floor2_number, floor1){
            var container_fillcolor = "230,230,250";
            var container_obj = new JTopo.Container();
            container_obj.layout = JTopo.layout.GridLayout(0, 1);
            container_obj.alpha = 0;
            container_obj.text= switch_details["sysname"];
            container_obj.font = "13px bold Consolas";
            container_obj.fontColor = "0,0,0";
            container_obj.fillColor = container_fillcolor;
            container_obj.setBound(x, y, w, h);   
            container_obj.borderRadius = 20;					
            container_obj.shadow = 0;
            container_obj.zIndex = 29;					

            popup_mouseover(container_obj, switch_details);

            scene.add(container_obj);			


            /*create the dummy container*/
            var container_obj_1 = new JTopo.Container();
            //container_obj_1.layout = JTopo.layout.GridLayout(2, 1);
            container_obj_1.alpha = 1;
            container_obj_1.text=switch_details["sysname"];
            container_obj_1.font = "13px bold Consolas";
            container_obj_1.fontColor = "0,0,0";
            container_obj_1.fillColor = container_fillcolor;
            container_obj_1.setBound(x, y, w, h);   
            container_obj_1.borderRadius = 20;					
            container_obj_1.shadow = 0;
            container_obj_1.zIndex = 19;					

            scene.add(container_obj_1);	

            container_obj_1.add(container_obj);



            /*create img_node*/
            var img_node = new JTopo.Node();
            var lenvel = 0;
            for (var n = 0; n < floor1.length; n++) {
                if (switch_details["sysname"] == floor1[n].switch_details["sysname"]) {
                    lenvel = 1;
                    break;
                }
            }
            if (lenvel == 1) {
                number = floor1_number;
                var img_path = "dashboard/img/img_topology/switch1.png";
            } else {
                number = floor2_number;
                var img_path = "dashboard/img/img_topology/switch2.png";
            }

            img_node.setImage(window.STATIC_URL + img_path);
            img_node.text = number;
            img_node.textPosition = "Middle_Center";
            img_node.textOffsetY = -9;
            img_node.font = "35px Consolas";
            img_node.scaleX = 1;
            img_node.zIndex = 28;
            img_node.setBound(x, y, 72, 72);   


            scene.add(img_node);
            container_obj.add(img_node);

            var sysname = switch_details["sysdescr"].toLowerCase();
            var arrName = ['lenovo', 'cisco', 'huawei', 'h3c', 'dcn', 'juniper'];
            for (var a = 0; a < arrName.length; a++) {
                if (sysname.indexOf(arrName[a]) > -1) {
                    arrName[a] = arrName[a][0].toUpperCase() + arrName[a].substring(1, arrName[a].length);
                    var brand = arrName[a];
                    break;
                }
            }


            /*create text_node*/
            var text_node = new JTopo.Node(brand);
            text_node.alpha = 1;
            //text_node.setSize(68, 15);
            text_node.textPosition = "Middle_Center";
            text_node.textOffsetY = -3;
            text_node.font = "15px bold Consolas";
            text_node.fillColor = "35,24,21";
            text_node.setBound(x+7, y+57, 60, 15);   
            text_node.borderRadius = 8;
            text_node.zIndex = 30;
            text_node.showSelected = false;					

            scene.add(text_node);
            container_obj.add(text_node);


            /*create link_node*/
            var link_node = new JTopo.Node(LINKLINE_NAME_TO);
            //link_node.setSize(62, 15);
            link_node.textPosition = "Middle_Center";
            link_node.textOffsetY = -3;
            link_node.font = "15px bold Consolas";
            link_node.fillColor = "35,24,21";
            link_node.zIndex = 14;
            link_node.setBound(x, y+10, 68, 15);   
            link_node.borderRadius = 8;
            link_node.alpha = 0;

            scene.add(link_node);
            container_obj.add(link_node);

            /*create link_node*/
            var link_node = new JTopo.Node(LINKLINE_NAME_FROM);
            //link_node.setSize(62, 15);
            link_node.textPosition = "Middle_Center";
            link_node.textOffsetY = -3;
            link_node.font = "15px bold Consolas";
            link_node.fillColor = "35,24,21";
            link_node.zIndex = 12;
            link_node.setBound(x, y+50, 68, 10);   
            link_node.borderRadius = 8;
            link_node.alpha = 0;

            scene.add(link_node);
            container_obj.add(link_node);

            return container_obj;
        }



        function add_switch_linkline(scene, node_from, node_to, color, link_text, link_count){
            var from_link_node = get_container_child_from(node_from);
            var to_link_node = get_container_child_to(node_to); 
            var linkTopo = new JTopo.Link(from_link_node, to_link_node, link_text);

            popup_mouseclick(linkTopo);

            //linkTopo.strokeColor = JTopo.util.randomColor();
            linkTopo.strokeColor = color;
            linkTopo.dashedPattern = link_count;
            linkTopo.bundleGap = 8; 
            linkTopo.bundleOffset = 0;
            linkTopo.textOffsetY = 0;
            linkTopo.lineWidth = 2;

            scene.add(linkTopo);
        }


        if (data.selection == '0') {

            var origin_switch_link_list = data.origin_switch_link_list || [];
            for (var aa = 0; aa < origin_switch_link_list.length; aa++) {
                origin_switch_link_list[aa]['link_details'] = origin_switch_link_list[aa]['link_details'].filter(function (element, index, array) {
                    return (element['status'] !== "4");
                })
            }

            var server_rack_list = data.server_rack_list || [];
            for (var a = 0; a < server_rack_list.length; a++) {
                server_rack_list[a]["serverlist"] = server_rack_list[a]["serverlist"].filter(function (element, index, array) {
                    return (element['status'] !== "4");
                })
            }
            server_rack_list = server_rack_list.filter(function (element, index, array) {
                return (element['serverlist'].length !== 0);
            });

            var switch_list = data.switch_list || [];
            var floorlist1 = [];
            var floorlist2 = [];
            var racklist = [];
            var switchlink = [];
            var linklist = [];
            var serverlink = [];
            var degree = [];
            var floor1 = [];
            var floor2 = [];
            var floor3 = [];
            var d = [];
            var floor4 = [];
            var floor5 = [];
            var countnum = 3;
            var countnum1 = 10;
            var racklist1 = [];
            var lenovoswitch = ["G8052", "G8332", "G8124"];
            var rackcount = 1;
            var linetime = 200;
            var nodetime = 1000;
            var switch_num1 = 0;
            var switch_num2 = switch_list.length + 1;
            var MAX_SERVER_RACK = 0, DEFAULT_SERVER_RACK = 8;

            for (var i = 0; i < origin_switch_link_list.length; i++) {
                for (var j = 0; j < origin_switch_link_list[i]["link_details"].length; j++) {
                    if (origin_switch_link_list[i]["link_details"][j]["color"] == "yellow") {
                        origin_switch_link_list[i]["link_details"][j]["color"] = "#7CFC00";
                    }
                    if (origin_switch_link_list[i]["link_details"][j]["color"] == "green") {
                        origin_switch_link_list[i]["link_details"][j]["color"] = "#2E8B57";
                    }
                    if (origin_switch_link_list[i]["link_details"][j]["color"] == "gray") {
                        origin_switch_link_list[i]["link_details"][j]["color"] = "#5E5E5E";
                    }
                }
            }

            for (var m = 0; m < origin_switch_link_list.length; m++) {
                //document.write(m);
                var link = [];
                var id = origin_switch_link_list[m]["switch_ip"];
                var switch_count = 0;
                var server_count = 0;
                for (var n = 0; n < origin_switch_link_list[m]["link_details"].length; n++) {
                    for (j = 0; j < switch_list.length; j++) {

                        if (origin_switch_link_list[m]["link_details"][n]["remchassisid"] == switch_list[j]["chassisid"] && origin_switch_link_list[m]["link_details"][n]["remsysname"] == switch_list[j]["sysname"]) {

                            switch_count++;
                            var newlink = {
                                "remportid": origin_switch_link_list[m]["link_details"]["remportid"],
                                "locportiddesc": origin_switch_link_list[m]["link_details"]["locportiddesc"],
                                "locchassisid": origin_switch_link_list[m]["link_details"]["locchassisid"],
                                "remsysname": origin_switch_link_list[m]["link_details"]["remsysname"],
                                "locsysname": origin_switch_link_list[m]["link_details"]["locsysname"],
                                "remchassisid": origin_switch_link_list[m]["link_details"]["remchassisid"],
                                "remportiddesc": origin_switch_link_list[m]["link_details"]["remportiddesc"],
                                "locportid": origin_switch_link_list[m]["link_details"]["locportid"],
                                "id": switch_list[j]["ip"]
                            };
                            link.push(newlink);

                        } else {

                            server_count++;
                        }
                    }

                }
                switchlink.push({
                    "switch_ip": origin_switch_link_list[m]["switch_ip"],
                "link_details": link
                });
                d.push(switch_count);
                // document.write(switch_count);
                degree.push({
                    "ip": id,
                    "switch_degree": switch_count,
                    "server_degree": server_count
                });
                //  document.write(degree[m]["ip"]);
            }
            function quicksort(v, left, right) {

                if (left < right) {
                    if (left < right) {
                        var key = v[left];
                        var low = left;
                        var high = right;
                        while (low < high) {
                            while (low < high && v[high] > key) {
                                high--;
                            }
                            if (low < high) v[low++] = v[high];
                            while (low < high && v[low] < key) {
                                low++;
                            }
                            if (low < high) v[high--] = v[low];
                        }
                        v[low] = key;
                        quicksort(v, left, low - 1);
                        quicksort(v, low + 1, right);
                    }
                }
            }

            quicksort(d, 0, d.length - 1);

            if (d.length % 2 == 0) {
                var mid = d[d.length / 2 - 1];

            } else {
                var mid = d[parseInt(d.length / 2)];
            }
            for (var p = 0; p < origin_switch_link_list.length; p++) {
                var d = 0;
                for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {
                    for (var a = 0; a < server_rack_list.length; a++) {
                        for (var b = 0; b < server_rack_list[a]["serverlist"].length; b++) {
                            if (origin_switch_link_list[p]["link_details"][q]["remchassisid"] == server_rack_list[a]["serverlist"][b]["chassisid"] && origin_switch_link_list[p]["link_details"][q]["remsysname"] == server_rack_list[a]["serverlist"][b]["sysname"]) {
                                d = 1;

                            }
                        }
                    }
                }
                if (d = 0) {
                    for (var c = 0; c < switch_list.length; c++) {
                        if (origin_switch_link_list[p]["switch_ip"] == switch_list[c]["ip"]) {
                            floor1.push({
                                "switch_details": switch_list[c],
                                "mark": 0
                            });
                        }
                    }
                } else {
                    for (var d = 0; d < switch_list.length; d++) {
                        if (origin_switch_link_list[p]["switch_ip"] == switch_list[d]["ip"]) {
                            floor2.push({
                                "switch_details": switch_list[d],
                                "mark": 0
                            });
                        }

                    }

                }
            }

            for (var e = 0; e < floor2.length; e++) {
                var count = 0;
                for (var f = 0; f < origin_switch_link_list.length; f++) {
                    if (floor2[e]["switch_details"]["ip"] == origin_switch_link_list[f]["switch_ip"]) {

                        for (var h = 0; h < origin_switch_link_list[f]["link_details"].length; h++) {
                            for (var g = 0; g < floor2.length; g++) {
                                if (origin_switch_link_list[f]["link_details"][h]["remchassisid"] == floor2[g]["switch_details"]["chassisid"] && origin_switch_link_list[f]["link_details"][h]["remsysname"] == floor2[g]["switch_details"]["sysname"]) {
                                    count = count + 1;

                                }

                            }
                        }
                    }
                }
                if (count < (mid + 1)) {
                    floor3.push({
                        "switch_details": floor2[e]["switch_details"],
                        'mark': 0
                    })
                } else {
                    floor1.push({
                        "switch_details": floor2[e]["switch_details"],
                        'mark': 0
                    })
                }

            }

            for (var i = 0; i < server_rack_list.length; i++) {
                var serverlist = server_rack_list[i]["serverlist"];
                var tuplelist = server_rack_list[i]["tuplelist"];
                racklist.push({
                    "serverlist": serverlist,
                    "tuplelist": tuplelist,
                    'status': "1",
                    "x": 0,
                    "y": 0,
                    "width": 0,
                    "node":0,
                    "mark": 0
                });
            }
            function treegen() {

                var id1 = 0;
                var id2 = 0;

                for (var j = 0; j < origin_switch_link_list[0]["link_details"].length; j++) {
                    for (var p = 0; p < floor3.length; p++) {

                        if (origin_switch_link_list[0]["link_details"][j]["remchassisid"] == floor3[p]["switch_details"]["chassisid"] && floor3[p]['mark'] == 0 && origin_switch_link_list[0]["link_details"][j]["remsysname"] == floor3[p]["switch_details"]["sysname"]) {
                            id2 = id2 + 1;
                            floor3[p]['mark'] = 1;
                            floorlist2.push({
                                "id": id2,
                                "switch_details": floor3[p]["switch_details"],
                                "x": 0,
                                "y": 0,
                                "markdown": 0,
                                "markup": 0,
                                "node" : 0,
                                "markh": 0
                            });
                        }
                    }
                }
                for (var q = 0; q < floor3.length; q++) {
                    if (origin_switch_link_list[0]["switch_ip"] == floor3[q]["switch_details"]["ip"]) {
                        id2 = id2 + 1;
                        floorlist2.push({
                            "id": id2,
                            "switch_details": floor3[q]["switch_details"],
                            "x": 0,
                            "y": 0,
                            "markdown": 0,
                            "markup": 0,
                            "markcircle": 0,
                            "node" : 0,
                            "markh": 0
                        });

                    }
                }

                for (var a = 0; a < floor1.length; a++) {
                    if (origin_switch_link_list[0]["switch_ip"] == floor1[a]["switch_details"]["ip"]) {
                        id1 = id1 + 1;
                        floorlist1.push({
                            "id": id1,
                            "switch_details": floor1[a]["switch_details"],
                            "x": 0,
                            "y": 0,
                            "markdown": 0,
                            "markup": 0,
                            "markcircle": 0,
                            "node" : 0,
                            "markh": 0
                        });

                    }
                }

                for (var i = 1; i < origin_switch_link_list.length; i++) {

                    for (var m = 0; m < origin_switch_link_list[i]["link_details"].length; m++) {

                        for (var k = 0; k < floor3.length; k++) {

                            if (origin_switch_link_list[i]["link_details"][m]["remchassisid"] == floor3[k]["switch_details"]["chassisid"] && origin_switch_link_list[i]["link_details"][m]["remsysname"] == floor3[k]["switch_details"]["sysname"]) {
                                var id = 0;
                                for (var n = 0; n < floorlist2.length; n++) {
                                    //    document.write( "true");
                                    if (origin_switch_link_list[i]["link_details"][m]["remchassisid"] == floorlist2[n]["switch_details"]["chassisid"] && origin_switch_link_list[i]["link_details"][m]["remsysname"] == floorlist2[n]["switch_details"]["sysname"]) {
                                        id = 1;
                                    }

                                }
                                if (id == 0) {
                                    id2 = id2 + 1;
                                    //    document.write( "true");
                                    floorlist2.push({
                                        "id": id2,
                                        "switch_details": floor3[k]["switch_details"],
                                        "x": 0,
                                        "y": 0,
                                        "markdown": 0,
                                        "markup": 0,
                                        "markcircle": 0,
                                        "node" : 0,
                                        "markh": 0
                                    });

                                }
                            }
                        }
                    }
                    for (var v = 0; v < floor3.length; v++) {
                        if (origin_switch_link_list[i]["switch_ip"] == floor3[v]["switch_details"]["ip"]) {
                            var id3 = 0;
                            for (var u = 0; u < floorlist2.length; u++) {
                                if (origin_switch_link_list[i]["switch_ip"] == floorlist2[u]["switch_details"]["ip"]) {
                                    id3 = 1;
                                }
                            }
                            if (id3 == 0) {
                                id2 = id2 + 1;
                                floorlist2.push({
                                    "id": id2,
                                    "switch_details": floor3[v]["switch_details"],
                                    "x": 0,
                                    "y": 0,
                                    "markdown": 0,
                                    "markup": 0,
                                    "markcircle": 0,
                                    "node" : 0,
                                    "markh": 0
                                });

                            }
                        }
                    }

                    for (var t = 0; t < floor1.length; t++) {
                        if (origin_switch_link_list[i]["switch_ip"] == floor1[t]["switch_details"]["ip"]) {
                            var id4 = 0;
                            for (var w = 0; w < floorlist1.length; w++) {
                                if (origin_switch_link_list[i]["switch_ip"] == floorlist1[w]["switch_details"]["ip"]) {
                                    id4 = 1;
                                    // document.write( id4);
                                }
                            }
                            if (id4 == 0) {
                                id1 = id1 + 1;
                                floorlist1.push({
                                    "id": id1,
                                    "switch_details": floor1[t]["switch_details"],
                                    "x": 0,
                                    "y": 0,
                                    "markdown": 0,
                                    "markup": 0,
                                    "markcircle": 0,
                                    "node" : 0,
                                    "markh": 0
                                });
                            }
                        }
                    }

                }

            }

            treegen();
            var move = 600;
            var c = 0;
            var num = [];
            for (var y = 0; y < floorlist2.length; y++) {
                for (var x = 0; x < racklist.length; x++) {

                    for (var z = 0; z < racklist[x]["tuplelist"].length; z++) {
                        if (racklist[x]["tuplelist"][z]["remsysname"] == floorlist2[y]["switch_details"]["sysname"]) {
                            var iq = 0;
                            for (var ab = 0; ab < num.length; ab++) {
                                if (x == num[ab]) {
                                    iq = 1;
                                }
                            }
                            if (iq == 0) {
                                num.push(x);
                                racklist1.push(racklist[x]);
                            }
                        }
                    }
                }
            }
            if (num.length < racklist.length) {
                for (var ac = 0; ac < racklist.length; ac++) {
                    var ic = 0;
                    for (var ad = 0; ad < num.length; ad++) {
                        if (ac == num[ad]) {
                            ic = 1;
                        }
                    }
                    if (ic == 0) {
                        racklist1.push(racklist[ac]);
                    }
                }
            }


            var number1 = floorlist2.length;
            var longMax = number1 * 72 + (number1 - 1) * 100;
            var number = racklist.length;
            var widthMax = 0;

            for (var i = 0; i < number; i++) {
                var singleNumber = racklist[i]["serverlist"].length;
                if (singleNumber % 12 == 0) {
                    widthMax = widthMax + 100 * (parseInt(singleNumber / 10));
                    racklist[i]["width"] = 60 * (parseInt(singleNumber / 10));

                } else {
                    widthMax = widthMax + 100 * (parseInt(singleNumber / 10) + 1);
                    racklist[i]["width"] = 60 * (parseInt(singleNumber / 10) + 1);
                }
            }
            widthMax = widthMax + 100 * (number - 1);

            document.getElementById('topologyCanvas').scrollTop = 150;
            document.getElementById('topologyCanvas').scrollLeft = 200;


            if (longMax > widthMax) {
                var isBeyondScreen = document.getElementById("topologyCanvas").offsetWidth - longMax;
                var SVGwidth = (isBeyondScreen) / 2 + longMax + 10;
                if (isBeyondScreen < 0) {
                    SVGwidth = longMax + 10;
                }
            } else {
                var isBeyondScreen = document.getElementById("topologyCanvas").offsetWidth - widthMax;
                var SVGwidth = (isBeyondScreen) / 2 + widthMax + 10;
                if (isBeyondScreen < 0) {
                    SVGwidth = widthMax + 10;
                }
            }

            var canvas = document.getElementById('canvas_proton_topo');
            canvas.height = 900 /*window.innerHeight*0.9*/;
            canvas.width = window.innerWidth * 0.8;

            var stage = new JTopo.Stage(canvas);
            //showJTopoToobar(stage);
            var scene = new JTopo.Scene();
            //scene.backgroundColor = '255,250,250';
            //scene.alpha = 100;
            //scene.mode = "select"; //"drag"
            scene.mode = "normal"; //"drag"
            //stage.zoomIn(0);
            stage.add(scene);


            function RndNum(n) {
                var rnd = "";
                for (var i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
                return rnd;
            }

            function node(cxt, x, y, switch_details, switch_num1, switch_num2) {

                var varify = 0;
                var lenvel = 0;
                for (var n = 0; n < floor1.length; n++) {
                    if (switch_details["sysname"] == floor1[n].switch_details["sysname"]) {
                        lenvel = 1;
                        break;
                    }
                }

                if (lenvel == 1) {
                    var node = cxt.image(window.STATIC_URL + "dashboard/img/img_topology/switch1.png", x, y, 72, 78);
                    cxt.text(x + 36, y + 36, switch_num1).attr({
                        fill: "#fff",
                        "font-size": "36px"
                    });
                } else {
                    var node = cxt.image(window.STATIC_URL + "dashboard/img/img_topology/switch2.png", x, y, 72, 78);
                    cxt.text(x + 36, y + 36, switch_num2).attr({
                        fill: "#fff",
                        "font-size": "36px"
                    });
                }

                var sysname = switch_details["sysdescr"].toLowerCase();
                var arrName = ['lenovo', 'cisco', 'huawei', 'h3c', 'dcn', 'juniper'];
                for (var a = 0; a < arrName.length; a++) {
                    if (sysname.indexOf(arrName[a]) > -1) {
                        arrName[a] = arrName[a][0].toUpperCase() + arrName[a].substring(1, arrName[a].length);
                        cxt.rect(x + 8, y + 62, 56, 15).attr({
                            fill: "#231815"
                        });
                        cxt.text(x + 36, y + 69, arrName[a]).attr({
                            fill: "#fff",
                            "font-size": "14px"
                        });
                        break;
                    }
                }

                cxt.text(x + 36, y + 89, switch_details["sysname"]).attr({
                    fill: "#3E434D",
                    "font-size": "14px"
                });
                var move = x;
                if (switch_details['status'] == "3") {
                    cxt.rect(x, y, 72, 78).attr({
                        "stroke": "#104E8B",
                        "stroke-dasharray": "--"
                    });
                }
                node.hover(function (e) {
                    var timer = setTimeout(function () {
                        document.getElementById("bl_1").style.display = "block";
                        document.getElementById("table").style.display = "block";
                        document.getElementById("foot").style.display = "block";
                        document.getElementById("tBody").style.display = "none";
                        var div = document.getElementById("bl_1");
                        var movey = y + 85;
                        div.style.top = movey + "px";
                        div.style.left = move + 45 - 100 + "px";
                        var bl = document.getElementById("tb")
                        var x = bl.createCaption();
                    for (var i = bl.rows.length - 1; i >= 0; i--) {
                        bl.deleteRow(i);
                    }

                    var row = bl.insertRow(bl.rows.length);
                    var row1 = bl.insertRow(bl.rows.length);
                    var row2 = bl.insertRow(bl.rows.length);
                    var cell1 = row.insertCell(row.cells.length);
                    var cell2 = row.insertCell(row.cells.length);
                    var cell3 = row1.insertCell(row1.cells.length);
                    var cell4 = row1.insertCell(row1.cells.length);
                    var cell5 = row2.insertCell(row2.cells.length);
                    var cell6 = row2.insertCell(row2.cells.length);
                    x.innerHTML = switch_details["sysname"];
                    cell1.innerHTML = gettext("ip:");
                    cell2.innerHTML = switch_details["ip"];
                    cell3.innerHTML = gettext("chassisid:");
                    cell4.innerHTML = switch_details["chassisid"];
                    cell5.innerHTML = gettext("sysname:");
                    cell6.innerHTML = switch_details["sysname"];

                    document.getElementById("m_title").innerHTML = gettext("manage the switch");
                    document.getElementById("link").innerHTML = "»" + gettext("view switch details");
                    document.getElementById("login").innerHTML = gettext("login the switch");
                    document.getElementById("login").style.width = "115px";
                    document.getElementById("shut").style.display = "none";
                    document.getElementById("restart").style.display = "none";

                    var str = RndNum(8);
                    // document.getElementById("link").href="/horizon/admin/switch/"+str+switch_details["chassisid"]+"/detail/";

                    var switch_id_fordetails = switch_details["oid"];
                    var switch_login = switch_details["id"];
                    document.getElementById("link").onclick = function () {
                        (new switchDetailAction()).open(switch_details['ip'], switch_id_fordetails);
                    }
                    document.getElementById("login").onclick = function () {
                        (new switchLoginAction()).open([{'id': switch_login}]);
                    }
                    /*                         document.getElementById("shut").onclick = function() {
                                               window.location.href = "/horizon/admin/switch/" + str + switch_details["chassisid"].substring(0, 2) + "%3A" + switch_details["chassisid"].substring(3, 5) + "%3A" + switch_details["chassisid"].substring(6, 8) + "%3A" + switch_details["chassisid"].substring(9, 11) + "%3A" + switch_details["chassisid"].substring(12, 14) + "%3A" + switch_details["chassisid"].substring(15, 17) + "/shutdownswitch/";
                                               }
                                               document.getElementById("restart").onclick = function() {
                                               window.location.href = "/horizon/admin/switch/" + str + switch_details["chassisid"].substring(0, 2) + "%3A" + switch_details["chassisid"].substring(3, 5) + "%3A" + switch_details["chassisid"].substring(6, 8) + "%3A" + switch_details["chassisid"].substring(9, 11) + "%3A" + switch_details["chassisid"].substring(12, 14) + "%3A" + switch_details["chassisid"].substring(15, 17) + "/rebootswitch/";
                                               }*/
                    },
                        nodetime); // modified 2000 to 1000  by lyj 2016/8/29
                },
                    function () {
                        clearTimeout(timer);
                    })

            }

            function server(cxt, container_rack, x, y, name, chassisid, server_details) {
                var str = RndNum(8);
                var names, container_server;
                if (name.length > 7) {
                    names = name.substring(0, 5) + "...";
                } else {
                    names = name;
                }


                if (server_details["status"] == 1) {
                    /*
                       var server = cxt.rect(x, y + 4, 85, 28).attr({
                       "stroke": "#AAC1D6",
                       "stroke-width": 3,
                       fill: "#BCD3E5"
                       });
                       */
                    var conf={'x':x,
                        'y':y + 4,
                        'w':85,
                        'h':28,
                        'borderwidth':3,
                        'bordercolor': "170,193,214"
                    };
                    container_server = create_rack_server(scene, container_rack, names, chassisid, server_details, conf);
                }
                if (server_details["status"] == 3) {
                    /*
                       var server = cxt.rect(x, y + 4, 85, 28).attr({
                       "stroke": "#8EAAC1",
                       "stroke-width": 1,
                       "stroke-dasharray": "--",
                       fill: "#BCD3E5"
                       });
                       */
                    var conf={'x':x,
                        'y':y + 4,
                        'w':85,
                        'h':28,
                        'borderwidth':1,
                        'bordercolor': "142,170,193"
                    };
                    container_server = create_rack_server(scene, container_rack, names, chassisid, server_details, conf);

                }

                /*
                   var hoet_id_fordetail = server_details['oid'];
                   server.click(function () {
                   (new createhostDetailAction()).open(hoet_id_fordetail);
                   });
                   var names;
                   if (name.length > 7) {
                   names = name.substring(0, 5) + "...";
                   } else {
                   names = name;
                   }

                   var text = cxt.text(x + 23, y + 15 + 4, names).attr({
                   "fill": "#000",
                   "font-size": "10px"
                   });
                   text.click(function () {
                   (new createhostDetailAction()).open(hoet_id_fordetail);

                   });
                   var move = x;

                   server.hover(function () {
                   timer = setTimeout(function () {
                   document.getElementById("bl_1").style.display = "block";
                   document.getElementById("table").style.display = "block";
                   document.getElementById("foot").style.display = "block";
                   document.getElementById("tBody").style.display = "block";
                   var bl = document.getElementById("tb");
                   var x = bl.createCaption();
                   var tBody = document.getElementById("tBody");
                   var x2 = document.getElementById("m_title");

                   for (var i = bl.rows.length - 1; i >= 0; i--) {
                   bl.deleteRow(i);
                   }
                   ;
                   for (var i = tBody.rows.length - 1; i >= 0; i--) {
                   tBody.deleteRow(i);
                   }

                   var row = bl.insertRow(bl.rows.length);
                   var row1 = bl.insertRow(bl.rows.length);
                   var row2 = bl.insertRow(bl.rows.length);
                   var cell1 = row.insertCell(row.cells.length);
                   var cell2 = row.insertCell(row.cells.length);
                   var cell3 = row1.insertCell(row1.cells.length);
                   var cell4 = row1.insertCell(row1.cells.length);
                   var cell5 = row2.insertCell(row2.cells.length);
                   var cell6 = row2.insertCell(row2.cells.length);

                   x.innerHTML = server_details["sysname"];
                   cell1.innerHTML = "&nbsp&nbsp" + gettext("ip:");
                   cell2.innerHTML = server_details["ip"];
                   cell3.innerHTML = "&nbsp&nbsp" + gettext("chassisid:");
                   cell4.innerHTML = server_details["chassisid"];
                   cell5.innerHTML = "&nbsp&nbsp" + gettext("sysname:");
                   cell6.innerHTML = server_details["sysname"];

                //document.getElementById("m_title").innerHTML = gettext("manage the server");
                var row21 = tBody.insertRow(tBody.rows.length);

                var cell21 = row21.insertCell(row21.cells.length);
                var cell22 = row21.insertCell(row21.cells.length);
                var cell23 = row21.insertCell(row21.cells.length);
                var cell24 = row21.insertCell(row21.cells.length);
                var cell25 = row21.insertCell(row21.cells.length);
                var cell26 = row21.insertCell(row21.cells.length);
                x2.innerHTML = gettext("manage the server");

                cell21.innerHTML = "&nbsp&nbsp" + gettext("server") + gettext("port");
                //cell22.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +  gettext("traffic status") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                cell23.innerHTML = gettext("Switch Name") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                cell24.innerHTML = "&nbsp&nbsp" + gettext("switch port") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                //cell25.innerHTML = "&nbsp&nbsp" +  gettext("traffic details") + "&nbsp&nbsp&nbsp&nbsp";
                cell26.innerHTML = "&nbsp&nbsp" + gettext("link status") + "&nbsp&nbsp&nbsp&nbsp";

                for (var cd = 0; cd < server_details['active_port_details'].length; cd++) {
                    for (var j = 0; j < switch_list.length; j++) {
                        if (server_details["active_port_details"][cd]["remchassisid"] == switch_list[j]["chassisid"]) {
                            var row22 = tBody.insertRow(tBody.rows.length);
                            var cell31 = row22.insertCell(row22.cells.length);
                            var cell32 = row22.insertCell(row22.cells.length);
                            var cell33 = row22.insertCell(row22.cells.length);
                            var cell34 = row22.insertCell(row22.cells.length);
                            var cell35 = row22.insertCell(row22.cells.length);
                            var cell36 = row22.insertCell(row22.cells.length);
                            cell31.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + server_details['active_port_details'][cd]["eth_name"];
                            cell33.innerHTML = server_details['active_port_details'][cd]["remsysname"];
                            if (server_details['status'] == "1" || server_details['status'] == 1) {
                                cell36.innerHTML = "&nbsp&nbsp" + "active";
                            }
                            if (server_details['status'] == "3" || server_details['status'] == 3) {
                                cell36.innerHTML = "&nbsp&nbsp" + "offline";
                            }
                            for (var k = 0; k < origin_switch_link_list.length; k++) {
                                if (switch_list[j]["ip"] == origin_switch_link_list[k]["switch_ip"]) {
                                    for (var z = 0; z < origin_switch_link_list[k]["link_details"].length; z++) {
                                        if (server_details["chassisid"] == origin_switch_link_list[k]["link_details"][z]["remchassisid"] && origin_switch_link_list[k]["link_details"][z]["remportiddesc"] == server_details["active_port_details"][cd]["eth_name"]) {
                                            //cell32.innerHTML = "&nbsp&nbsp" + '<div class="portStatus"style="border-right:90px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';border-bottom:2px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';margin-bottom:10px;"></div>';

                                            var portindex = origin_switch_link_list[k]["link_details"][z]["locportindex"];
                                            if (origin_switch_link_list[k]["link_details"][z]["color"] == "#5E5E5E") {
                                                //cell35.innerHTML = "&nbsp&nbsp&nbsp" + gettext("no details");
                                            } else {
                                                var inputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|input|" + portindex + "/detail/";
                                                var outputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|output|" + portindex + "/detail/";
                                                var inTrafficData = {
                                                    queryType: 'realtime',
                                                    ip: switch_list[j]["ip"],
                                                    locportindex: portindex
                                                };
                                                //cell35.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                                                cell35.onclick = function (event) {
                                                    event = event || window.event;
                                                    var ele = event.target;
                                                    if ($(ele).attr('class') == 'traficinputDetail') {
                                                        inTrafficData.direction = 'input';
                                                        (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                    } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                                        inTrafficData.direction = 'output';
                                                        (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                    }
                                                };
                                            }
                                        }
                                        for (var p = 0; p < origin_switch_link_list.length; p++) {
                                            if (switch_list[j]["ip"] == origin_switch_link_list[p]["switch_ip"]) {
                                                for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {
                                                    if (origin_switch_link_list[p]["link_details"][q]["remchassisid"] == server_details["chassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == server_details['active_port_details'][cd]["eth_name"]) {
                                                        cell34.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + origin_switch_link_list[p]["link_details"][q]["locportid"] + "&nbsp&nbsp&nbsp&nbsp&nbsp";

                                                    }
                                                }
                                            }
                                        }
                                        ;
                                    }
                                }
                            }

                        }

                    }

                }
                document.getElementById("link").innerHTML = "»" + gettext("view server details");
                document.getElementById("restart").style.display = "block";
                document.getElementById("restart").style.width = "50px";
                document.getElementById("restart").style.height = "30px";
                document.getElementById("restart").innerHTML = gettext("reboot");
                document.getElementById("login").style.width = "40px";
                document.getElementById("login").style.height = "30px";
                document.getElementById("login").style.display = "block";
                document.getElementById("shut").style.display = "none";
                document.getElementById("login").innerHTML = gettext("login");
                var div = document.getElementById("bl_1");
                var movey = y + 40;
                div.style.top = movey + "px";
                //div.style.left = move + "px";
                div.style.left = move + 50 - 100 + "px";
                var str = RndNum(8);


                //document.getElementById("link").href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/detail/";
                var hoet_id_fordetail = server_details["oid"];
                var hoet_id_forlogin = server_details["id"];
                document.getElementById("link").onclick = function () {
                    (new createhostDetailAction()).open(hoet_id_fordetail);
                }
                document.getElementById("login").onclick = function () {
                    (new hostLoginAction()).open([{'id': hoet_id_forlogin}]);
                }
                document.getElementById("shut").onclick = function () {
                    window.location.href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/shutdownhost/";
                }
                document.getElementById("restart").onclick = function () {
                    (new hostRebootAction()).open([{'id': hoet_id_forlogin}]);
                }

        },
           nodetime);
        },
           function () { // modified 2000 to 1000  by lyj 2016/8/29
               clearTimeout(timer);

           })

        text.hover(function (e) {
            timer = setTimeout(function () {

                document.getElementById("bl_1").style.display = "block";
                document.getElementById("table").style.display = "block";
                document.getElementById("foot").style.display = "block";
                document.getElementById("tBody").style.display = "block";
                var bl = document.getElementById("tb");
                var x = bl.createCaption();
                var tBody = document.getElementById("tBody");
                var x2 = document.getElementById("m_title");

                for (var i = bl.rows.length - 1; i >= 0; i--) {
                    bl.deleteRow(i);
                }
                for (var i = tBody.rows.length - 1; i >= 0; i--) {
                    tBody.deleteRow(i);
                }
                var row = bl.insertRow(bl.rows.length);
                var row1 = bl.insertRow(bl.rows.length);
                var row2 = bl.insertRow(bl.rows.length);
                var cell1 = row.insertCell(row.cells.length);
                var cell2 = row.insertCell(row.cells.length);
                var cell3 = row1.insertCell(row1.cells.length);
                var cell4 = row1.insertCell(row1.cells.length);
                var cell5 = row2.insertCell(row2.cells.length);
                var cell6 = row2.insertCell(row2.cells.length);

                x.innerHTML = server_details["sysname"];
                cell1.innerHTML = gettext("ip:");
                cell2.innerHTML = server_details["ip"];
                cell3.innerHTML = gettext("chassisid:");
                cell4.innerHTML = server_details["chassisid"];
                cell5.innerHTML = gettext("sysname:");
                cell6.innerHTML = server_details["sysname"];

                var row21 = tBody.insertRow(tBody.rows.length);

                var cell21 = row21.insertCell(row21.cells.length);
                var cell22 = row21.insertCell(row21.cells.length);
                var cell23 = row21.insertCell(row21.cells.length);
                var cell24 = row21.insertCell(row21.cells.length);
                var cell25 = row21.insertCell(row21.cells.length);
                var cell26 = row21.insertCell(row21.cells.length);
                x2.innerHTML = gettext("manage the server");

                cell21.innerHTML = "&nbsp&nbsp" + gettext("server") + gettext("port");
                //cell22.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +  gettext("traffic status") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                cell23.innerHTML = gettext("Switch Name") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                cell24.innerHTML = "&nbsp&nbsp" + gettext("switch port") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                //cell25.innerHTML = "&nbsp&nbsp" +  gettext("traffic details") + "&nbsp&nbsp&nbsp&nbsp";
                cell26.innerHTML = "&nbsp&nbsp" + gettext("link status") + "&nbsp&nbsp&nbsp&nbsp";

                for (var cd = 0; cd < server_details['active_port_details'].length; cd++) {
                    for (var j = 0; j < switch_list.length; j++) {
                        if (server_details["active_port_details"][cd]["remchassisid"] == switch_list[j]["chassisid"]) {
                            var row22 = tBody.insertRow(tBody.rows.length);
                            var cell31 = row22.insertCell(row22.cells.length);
                            var cell32 = row22.insertCell(row22.cells.length);
                            var cell33 = row22.insertCell(row22.cells.length);
                            var cell34 = row22.insertCell(row22.cells.length);
                            var cell35 = row22.insertCell(row22.cells.length);
                            var cell36 = row22.insertCell(row22.cells.length);
                            cell31.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + server_details['active_port_details'][cd]["eth_name"];
                            cell33.innerHTML = server_details['active_port_details'][cd]["remsysname"];
                            if (server_details['status'] == "1" || server_details['status'] == 1) {
                                cell36.innerHTML = "&nbsp&nbsp" + "active";
                            }
                            if (server_details['status'] == "3" || server_details['status'] == 3) {
                                cell36.innerHTML = "&nbsp&nbsp" + "offline";
                            }
                            for (var k = 0; k < origin_switch_link_list.length; k++) {
                                if (switch_list[j]["ip"] == origin_switch_link_list[k]["switch_ip"]) {
                                    for (var z = 0; z < origin_switch_link_list[k]["link_details"].length; z++) {
                                        if (server_details["chassisid"] == origin_switch_link_list[k]["link_details"][z]["remchassisid"] && origin_switch_link_list[k]["link_details"][z]["remportiddesc"] == server_details["active_port_details"][cd]["eth_name"]) {
                                            //cell32.innerHTML = "&nbsp&nbsp" + '<div class="portStatus"style="border-right:90px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';border-bottom:2px solid' + origin_switch_link_list[k]["link_details"][z]["color"] + ';margin-bottom:10px;"></div>';

                                            var portindex = origin_switch_link_list[k]["link_details"][z]["locportindex"];
                                            if (origin_switch_link_list[k]["link_details"][z]["color"] == "#5E5E5E") {
                                                //cell35.innerHTML = "&nbsp&nbsp&nbsp" + gettext("no details");
                                            } else {
                                                var inputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|input|" + portindex + "/detail/";
                                                var outputlink = "/horizon/admin/traffic/" + switch_list[j]["ip"] + "|output|" + portindex + "/detail/";
                                                var inTrafficData = {
                                                    queryType: 'realtime',
                                                    ip: switch_list[j]["ip"],
                                                    locportindex: portindex
                                                };
                                                //cell35.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                                                cell35.onclick = function (event) {
                                                    event = event || window.event;
                                                    var ele = event.target;
                                                    if ($(ele).attr('class') == 'traficinputDetail') {
                                                        inTrafficData.direction = 'input';
                                                        (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                    } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                                        inTrafficData.direction = 'output';
                                                        (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                    }
                                                };
                                            }
                                        }
                                        for (var p = 0; p < origin_switch_link_list.length; p++) {
                                            if (switch_list[j]["ip"] == origin_switch_link_list[p]["switch_ip"]) {
                                                for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {
                                                    if (origin_switch_link_list[p]["link_details"][q]["remchassisid"] == server_details["chassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == server_details['active_port_details'][cd]["eth_name"]) {
                                                        cell34.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + origin_switch_link_list[p]["link_details"][q]["locportid"] + "&nbsp&nbsp&nbsp&nbsp&nbsp";

                                                    }
                                                }
                                            }
                                        }
                                        ;
                                    }
                                }
                            }

                        }

                    }

                }

                //document.getElementById("m_title").innerHTML = gettext("manage the server");


                document.getElementById("link").innerHTML = "»" + gettext("view server details");
                document.getElementById("restart").style.display = "block";
                document.getElementById("restart").style.width = "50px";
                document.getElementById("restart").style.height = "30px";
                document.getElementById("restart").innerHTML = gettext("reboot");
                document.getElementById("login").style.width = "40px";
                document.getElementById("login").style.height = "30px";
                document.getElementById("login").style.display = "block";
                document.getElementById("shut").style.display = "none";
                document.getElementById("login").innerHTML = gettext("login");
                var div = document.getElementById("bl_1");
                var movey = y + 35;
                div.style.top = movey + "px";
                //div.style.left = move -5 + "px";
                div.style.left = move + 45 - 100 + "px";
                var str = RndNum(8);
                //document.getElementById("link").href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/detail/";
                var hoet_id_fordetail = server_details["oid"];
                var hoet_id_forlogin = server_details["id"];
                document.getElementById("link").onclick = function () {
                    (new createhostDetailAction()).open(hoet_id_fordetail);
                }
                document.getElementById("login").onclick = function () {
                    (new hostLoginAction()).open([{'id': hoet_id_forlogin}]);
                }
                document.getElementById("shut").onclick = function () {
                    window.location.href = "/horizon/admin/host/" + str + server_details["chassisid"].substring(0, 2) + "%3A" + server_details["chassisid"].substring(3, 5) + "%3A" + server_details["chassisid"].substring(6, 8) + "%3A" + server_details["chassisid"].substring(9, 11) + "%3A" + server_details["chassisid"].substring(12, 14) + "%3A" + server_details["chassisid"].substring(15, 17) + "/shutdownhost/";
                }
                document.getElementById("restart").onclick = function () {
                    (new hostRebootAction()).open([{'id': hoet_id_forlogin}]);
                }

            },
            nodetime);
        },
            function () { // modified 2000 to 1000  by lyj 2016/8/29
                clearTimeout(timer);

            })

        */

            var portlist = [];
        var c = 0;
        for (var i = 0; i < server_details["active_port_details"].length; i++) {
            if (server_details["active_port_details"][i]["eth_name"].substring(0, 3) == "eth") {
                var port = parseInt(server_details["active_port_details"][i]["eth_name"].substring(3, 4));

            } else {

                var port = c;
                c++;
            }

            portlist.push(port);
            for (var j = 0; j < switch_list.length; j++) {

                if (server_details["active_port_details"][i]["remchassisid"] == switch_list[j]["chassisid"]) {

                    for (var p = 0; p < origin_switch_link_list.length; p++) {
                        if (switch_list[j]["ip"] == origin_switch_link_list[p]["switch_ip"]) {
                            for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {

                                if (server_details["chassisid"] == origin_switch_link_list[p]["link_details"][q]["remchassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == server_details["active_port_details"][i]["eth_name"]) {

                                    if (port < 4) {
                                        /*
                                           cxt.rect(x + 50 + (port * 6) + 1, y + 5 + 4, 4, 4).attr({
                                           "fill": origin_switch_link_list[p]["link_details"][q]["color"],
                                           "stroke": "white",
                                           "stroke-width": 0
                                           });
                                           */

                                        var conf = {'x':x + 50 + (port * 6) + 1,
                                            'y': y + 5 + 4,
                                            'w': 4,
                                            'h': 4,
                                            'fillcolor': origin_switch_link_list[p]["link_details"][q]["color"]
                                        }; 
                                        //create the server's lamplet
                                        draw_rack_lamplet(scene, container_server, conf);

                                    } else {
                                        /*
                                           cxt.rect(x + 50 + ((port - 4) * 6) + 1, y + 10 + 9 + 4, 4, 4).attr({
                                           "fill": origin_switch_link_list[p]["link_details"][q]["color"],
                                           "stroke": "white",
                                           "stroke-width": 0
                                           });
                                           */

                                        var conf = {'x':x + 50 + ((port - 4) * 6) + 1,
                                            'y': y + 10 + 9 + 4,
                                            'w': 4,
                                            'h': 4,
                                            'fillcolor': origin_switch_link_list[p]["link_details"][q]["color"]
                                        }; 
                                        //create the server's lamplet
                                        draw_rack_lamplet(scene, container_server,  conf);
                                    }

                                }
                            }
                        }
                    }
                }
            }

        }
        for (var m = 0; m < 4; m++) {
            var id = 0;
            for (var t = 0; t < portlist.length; t++) {
                if (m == portlist[t]) {
                    id = 1;
                }

            }
            if (id == 0) {
                /*
                   cxt.rect(x + 50 + (m * 6) + 1, y + 5 + 4, 4, 4).attr({
                   "fill": "#8B8989",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   cxt.rect(x + 50, y + 10 + 3 + 4, 26, 2).attr({
                   "fill": "#121217",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   */
                var conf = {'x': x + 50 + (m * 6) + 1,
                    'y': y + 5 + 4,
                    'w': 4,
                    'h': 4,
                    'fillcolor': "139,137,137"  
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);

                var conf = {'x': x + 50,
                    'y': y + 10 + 3 + 4,
                    'w': 26,
                    'h': 2,
                    'fillcolor': "18,18,23" 
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);

            }
        }

        for (var m = 0; m < 4; m++) {
            var id = 0;
            for (var t = 0; t < portlist.length; t++) {
                if (m == portlist[t] - 4) {
                    id = 1;
                }

            }

            if (id == 0) {
                /*
                   cxt.rect(x + 50 + (m * 6) + 1, y + 10 + 9 + 4, 4, 4).attr({
                   "fill": "#8B8989",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   cxt.rect(x + 50, y + 10 + 3 + 4, 26, 2).attr({
                   "fill": "#121217",
                   "stroke": "white",
                   "stroke-width": 0
                   });
                   */

                var conf = {'x': x + 50 + (m * 6) + 1,
                    'y': y + 10 + 9 + 4,
                    'w': 4,
                    'h': 4,
                    'fillcolor': "139,137,137" 
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);

                var conf = {'x': x + 50,
                    'y': y + 10 + 3 + 4,
                    'w': 26,
                    'h': 2,
                    'fillcolor': "18,18,23"  
                }; 
                //create the server's lamplet
                draw_rack_lamplet(scene, container_server, conf);
            }
        }

            }


            function line_switch(cxt, x1, y1, x2, y2, connectmessage) {
                if (connectmessage[0]['link_details']['status'] == '3') {
                    var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                        "stroke": connectmessage[0]["link_details"]["color"],
                        "stroke-width": 2,
                        "stroke-dasharray": "--"
                    });
                }
                if (connectmessage[0]['link_details']['status'] == "1") {
                    var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                        "stroke": connectmessage[0]["link_details"]["color"],
                        "stroke-width": 2
                    });

                }
                path.hover(function (event) {

                    var e = document.all ? window.event : arguments[0] ? arguments[0] : event;
                    document.getElementById("bl_1").style.display = "block";
                    document.getElementById("table").style.display = "none";
                    document.getElementById("foot").style.display = "none";

                    var div = document.getElementById("bl_1");
                    var movey = (y1 + y2) / 2;
                    var movex = (x1 + x2) / 2;

                    div.style.top = e.layerY + 8 + "px" ;
                    div.style.left = e.layerX + 8 - 100 + "px" ;
                    var bl = document.getElementById("tb");
                    var x = bl.createCaption();

                    for (var i = bl.rows.length - 1; i >= 0; i--) {
                        bl.deleteRow(i);

                    }

                    var row = bl.insertRow(bl.rows.length);
                    var row1 = bl.insertRow(bl.rows.length);
                    var row2 = bl.insertRow(bl.rows.length);
                    var row3 = bl.insertRow(bl.rows.length);
                    var row4 = bl.insertRow(bl.rows.length);
                    var cell1 = row.insertCell(row.cells.length);
                    var cell2 = row.insertCell(row.cells.length);
                    var cell3 = row1.insertCell(row1.cells.length);
                    var cell4 = row1.insertCell(row1.cells.length);
                    var cell5 = row2.insertCell(row2.cells.length);
                    var cell6 = row2.insertCell(row2.cells.length);
                    var cell7 = row3.insertCell(row3.cells.length);
                    var cell8 = row3.insertCell(row3.cells.length);
                    var cell9 = row4.insertCell(row4.cells.length);
                    var cell10 = row4.insertCell(row4.cells.length);
                    x.innerHTML = gettext("link details");
                    cell1.innerHTML = gettext("src_switch:");
                    cell2.innerHTML = connectmessage[0]["src_switch"];
                    cell3.innerHTML = gettext("src_port:");
                    cell4.innerHTML = connectmessage[0]["src_port"];
                    cell5.innerHTML = gettext("dst_switch:");
                    cell6.innerHTML = connectmessage[0]["dst_switch"];
                    cell7.innerHTML = gettext("dst_port:");
                    cell8.innerHTML = connectmessage[0]["dst_port"];
                    //cell9.innerHTML = gettext("traffic details:");
                    if (connectmessage[0]["link_details"]["color"] == "#5E5E5E") {
                        //cell10.innerHTML = gettext("no details");
                    } else {

                        /*                          var inputlink = "/horizon/admin/traffic/" + connectmessage[0]["link_details"]["id"] + "|input|" + connectmessage[0]["link_details"]["locportindex"] + "/detail/";
                                                    var outputlink = "/horizon/admin/traffic/" + connectmessage[0]["link_details"]["id"] + "|output|" + connectmessage[0]["link_details"]["locportindex"] + "/detail/";
                                                    cell10.innerHTML = ' <a style="text-decoration:underline" href=' + inputlink + '> ' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" href=' + outputlink + '>' + gettext("output") + '</a>';*/
                        var inTrafficData = {
                            queryType: 'realtime',
                            ip: connectmessage[0]['link_details']["id"],
                            locportindex: connectmessage[0]["link_details"]["locportindex"]
                        };
                        //cell9.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                        cell9.onclick = function (event) {
                            event = event || window.event;
                            var ele = event.target;
                            if ($(ele).attr('class') == 'traficinputDetail') {
                                inTrafficData.direction = 'input';
                                (new lenovoTrafficsAction()).openDetail(inTrafficData);
                            } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                inTrafficData.direction = 'output';
                                (new lenovoTrafficsAction()).openDetail(inTrafficData);
                            }
                        }

                    }

                })
            }

            function line_circle(cxt, x1, y1, r1, percent, a, b, connectmessage) {
                var drawPercent = percent >= 1 ? 0.9999 : percent;
                var PI = Math.PI;

                var x2 = x1 + r1 * Math.sin(2 * PI * (1 - drawPercent));

                var y2 = y1 - r1 + r1 * Math.cos(2 * PI * (1 - drawPercent));

                if (connectmessage[0]['link_details']['status'] == "1") {
                    var path = cxt.path(["M", x1, y1, "A", r1 + a, r1 - b, "0", percent > 0.5 ? 1 : 0, "0", x2, y2]).attr({
                        "stroke": connectmessage[0]["link_details"]["color"],
                        "stroke-width": 2
                    })
                }
                if (connectmessage[0]['link_details']['status'] == '3') {
                    var path = cxt.path(["M", x1, y1, "A", r1 + a, r1 - b, "0", percent > 0.5 ? 1 : 0, "0", x2, y2]).attr({
                        "stroke": connectmessage[0]["link_details"]["color"],
                        "stroke-width": 2,
                        "stroke-dasharray": "--"
                    })
                }
                path.hover(function (event) {

                    //timer = setTimeout(function() {

                    var e = document.all ? window.event : arguments[0] ? arguments[0] : event;

                    document.getElementById("bl_1").style.display = "block";
                    document.getElementById("table").style.display = "none";
                    document.getElementById("foot").style.display = "none";

                    var div = document.getElementById("bl_1");
                    var movey = (y1 + y2) / 2;
                    var movex = (x1 + x2) / 2;
                    //div.style.top = movey + 20+"px";
                    //div.style.left = movex -30+ "px";

                    div.style.top = e.layerY + 8 + "px" ;
                    div.style.left = e.layerX + 8 - 100 + "px" ;
                    var bl = document.getElementById("tb");
                    var x = bl.createCaption();

                    for (var i = bl.rows.length - 1; i >= 0; i--) {
                        bl.deleteRow(i);

                    }

                    var row = bl.insertRow(bl.rows.length);
                    var row1 = bl.insertRow(bl.rows.length);
                    var row2 = bl.insertRow(bl.rows.length);
                    var row3 = bl.insertRow(bl.rows.length);
                    var row4 = bl.insertRow(bl.rows.length);
                    var cell1 = row.insertCell(row.cells.length);
                    var cell2 = row.insertCell(row.cells.length);
                    var cell3 = row1.insertCell(row1.cells.length);
                    var cell4 = row1.insertCell(row1.cells.length);
                    var cell5 = row2.insertCell(row2.cells.length);
                    var cell6 = row2.insertCell(row2.cells.length);
                    var cell7 = row3.insertCell(row3.cells.length);
                    var cell8 = row3.insertCell(row3.cells.length);
                    var cell9 = row4.insertCell(row4.cells.length);
                    var cell10 = row4.insertCell(row4.cells.length);

                    x.innerHTML = gettext("link details");
                    cell1.innerHTML = gettext("src_switch:");
                    cell2.innerHTML = connectmessage[0]["src_switch"];
                    cell3.innerHTML = gettext("src_port:");
                    cell4.innerHTML = connectmessage[0]["src_port"];
                    cell5.innerHTML = gettext("dst_switch:");
                    cell6.innerHTML = connectmessage[0]["dst_switch"];
                    cell7.innerHTML = gettext("dst_port:");
                    cell8.innerHTML = connectmessage[0]["dst_port"];
                    //cell9.innerHTML = gettext("traffic details");
                    if (connectmessage[0]["link_details"]["color"] == "#5E5E5E") {
                        //cell10.innerHTML = gettext("no details");
                    } else {

                        /*                          var inputlink = "/horizon/admin/traffic/" + connectmessage[0]["link_details"]["id"] + "|input|" + connectmessage[0]["link_details"]["locportindex"] + "/detail/";
                                                    var outputlink = "/horizon/admin/traffic/" + connectmessage[0]["link_details"]["id"] + "|output|" + connectmessage[0]["link_details"]["locportindex"] + "/detail/";
                                                    cell10.innerHTML = '<a style="text-decoration:underline" href=' + inputlink + '> ' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" href=' + outputlink + '>' + gettext("output") + '</a>';*/
                        var inTrafficData = {
                            queryType: 'realtime',
                            ip: connectmessage[0]['link_details']["id"],
                            locportindex: connectmessage[0]["link_details"]["locportindex"]
                        };
                        //cell9.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                        cell9.onclick = function (event) {
                            event = event || window.event;
                            var ele = event.target;
                            if ($(ele).attr('class') == 'traficinputDetail') {
                                inTrafficData.direction = 'input';
                                (new lenovoTrafficsAction()).openDetail(inTrafficData);
                            } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                inTrafficData.direction = 'output';
                                (new lenovoTrafficsAction()).openDetail(inTrafficData);
                            }
                        }
                    }
                    //},
                    //linetime);
                })
            }

            function line_rack(cxt, x1, y1, x2, y2, connectmessage, line) {

                var colorred = 0;
                var coloryellow = 0;
                var status = 0;
                var colorgreen = 0;
                var colorgray = 0;
                for (var i = 0; i < origin_switch_link_list.length; i++) {
                    if (connectmessage[0]["switch_ip"] == origin_switch_link_list[i]["switch_ip"]) {
                        for (var j = 0; j < connectmessage[0]["racklist"]["serverlist"].length; j++) {
                            for (var p = 0; p < origin_switch_link_list[i]["link_details"].length; p++) {
                                if (connectmessage[0]["racklist"]["serverlist"][j]["chassisid"] == origin_switch_link_list[i]["link_details"][p]["remchassisid"] && connectmessage[0]["tuplelist"]["eth_name"] == origin_switch_link_list[i]["link_details"][p]["remportiddesc"]) {

                                    if (origin_switch_link_list[i]["link_details"][p]["color"] == "red") {
                                        colorred = 1;
                                    }
                                    if (origin_switch_link_list[i]["link_details"][p]["color"] == "#7CFC00") {
                                        coloryellow = 1;
                                    }
                                    if (origin_switch_link_list[i]["link_details"][p]["color"] == "#2E8B57") {

                                        colorgreen = 1;
                                    }
                                    if (origin_switch_link_list[i]["link_details"][p]["color"] == "#5E5E5E") {
                                        colorgray = 1;
                                    }
                                    if (line == "dotted") {
                                        if (origin_switch_link_list[i]["link_details"][p]["status"] == "3" || origin_switch_link_list[i]["link_details"][p]["status"] == 3) {
                                            status = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (status == 0) {
                    if (colorred == 0 && coloryellow == 0 && colorgreen == 0 && colorgray == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "#5E5E5E",
                            "stroke-width": 2
                        })
                    }
                    if (colorred == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "red",
                            "stroke-width": 2
                        })
                    }
                    if (colorred == 0 && coloryellow == 0 && colorgreen == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "#2E8B57",
                            "stroke-width": 2
                        })
                    }
                    if (colorred == 0 && coloryellow == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "#7CFC00",
                            "stroke-width": 2
                        })
                    }
                }
                if (status == 1) {

                    if (colorred == 0 && coloryellow == 0 && colorgreen == 0 && colorgray == 1) {
                        var path = cxt.path(["M", x1 + 3, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "#5E5E5E",
                            "stroke-dasharray": "- .",
                            "stroke-width": 2
                        })
                    }
                    if (colorred == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "red",
                            "stroke-width": 2,
                            "stroke-dasharray": "- ."
                        })
                    }
                    if (colorred == 0 && coloryellow == 0 && colorgreen == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "#2E8B57",
                            "stroke-width": 2,
                            "stroke-dasharray": '- .'
                        })
                    }
                    if (colorred == 0 && coloryellow == 1) {
                        var path = cxt.path(["M", x1, y1, "L", x2, y2, "Z"]).attr({
                            "stroke": "#7CFC00",
                            "stroke-width": 2,
                            "stroke-dasharray": "- ."
                        })
                    }

                }

                path.hover(function (event) {

                    var e = document.all ? window.event : arguments[0] ? arguments[0] : event;

                    //timer = setTimeout(function() {
                    document.getElementById("bl_1").style.display = "block";
                    document.getElementById("table").style.display = "none";
                    document.getElementById("foot").style.display = "none";
                    var div = document.getElementById("bl_1");
                    //var movey = 2 / 3 * y2 + 1 / 3 * y1;
                    //var movex = (x1 + x2) / 2;
                    //div.style.top = movey +55+ "px";
                    //div.style.left = movex + 5 +"px";
                    var movey = (y1 + y2) / 2;
                    var movex = (x1 + x2) / 2;

                    div.style.top = e.layerY + 8 + "px" ;
                    div.style.left = e.layerX + 8 - 100 + "px" ;

                    var bl = document.getElementById("tb")
                        var x = bl.createCaption();
                    for (var i = bl.rows.length - 1; i >= 0; i--) {
                        bl.deleteRow(i);
                    }
                    x.innerHTML = gettext("connected switch:") + connectmessage[0]["sysname"];
                    var row = bl.insertRow(bl.rows.length);
                    var row1 = bl.insertRow(bl.rows.length);

                    var cell1 = row.insertCell(row.cells.length);
                    var cell2 = row.insertCell(row.cells.length);
                    var cell3 = row.insertCell(row.cells.length);
                    var cell7 = row.insertCell(row.cells.length);
                    var cell8 = row.insertCell(row.cells.length);
                    var cell20 = row.insertCell(row.cells.length);
                    cell1.innerHTML = gettext("server name") + "&nbsp&nbsp&nbsp";
                    cell2.innerHTML = "&nbsp&nbsp" + gettext("server") + "&nbsp&nbsp&nbsp" + gettext("port") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                    cell3.innerHTML = gettext("switch port") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                    //cell7.innerHTML = gettext("traffic details") + "&nbsp&nbsp&nbsp&nbsp";
                    //cell8.innerHTML = gettext("traffic status") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                    cell20.innerHTML = gettext("link status") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";

                    for (var i = 0; i < connectmessage[0]["racklist"]["serverlist"].length; i++) {

                        var row1 = bl.insertRow(bl.rows.length);
                        var cell4 = row1.insertCell(row1.cells.length);
                        var cell5 = row1.insertCell(row1.cells.length);
                        var cell6 = row1.insertCell(row1.cells.length);
                        var cell9 = row1.insertCell(row1.cells.length);
                        var cell10 = row1.insertCell(row1.cells.length);
                        var cell21 = row1.insertCell(row1.cells.length);
                        cell4.innerHTML = connectmessage[0]["racklist"]["serverlist"][i]["sysname"];
                        cell5.innerHTML = "&nbsp&nbsp" + connectmessage[0]["tuplelist"]["eth_name"];
                        //if (parseInt(connectmessage[0]["racklist"]["serverlist"][i]['status']) == 1) {
                        //    cell21.innerHTML = "&nbsp&nbsp" + "active";
                        //}
                        //if (parseInt(connectmessage[0]["racklist"]["serverlist"][i]['status'] == 3)) {
                        //    cell21.innerHTML = "&nbsp&nbsp" + "offline";
                        //}
                        if ( status == 0) {
                            cell21.innerHTML = "&nbsp&nbsp" + "active";
                        }
                        if ( status == 1) {
                            cell21.innerHTML = "&nbsp&nbsp" + "offline";
                        }
                        for (var k = 0; k < origin_switch_link_list.length; k++) {
                            if (connectmessage[0]["switch_ip"] == origin_switch_link_list[k]["switch_ip"]) {
                                for (var z = 0; z < origin_switch_link_list[k]["link_details"].length; z++) {
                                    if (connectmessage[0]["racklist"]["serverlist"][i]["chassisid"] == origin_switch_link_list[k]["link_details"][z]["remchassisid"]) {
                                        var portindex = origin_switch_link_list[k]["link_details"][z]["locportindex"];
                                        //cell10.innerHTML = '<div class="status"style="left:5px;width: 10px; height: 10px;background: ' + origin_switch_link_list[k]["link_details"][z]["color"] + ';-moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;"></div>';
                                        if (colorgray == 1) {
                                            //cell9.innerHTML = "&nbsp" + gettext("no details");
                                        } else {
                                            var inputlink = "/horizon/admin/traffic/" + connectmessage[0]["switch_ip"] + "|input|" + portindex + "/detail/";
                                            var outputlink = "/horizon/admin/traffic/" + connectmessage[0]["switch_ip"] + "|output|" + portindex + "/detail/"
                                                var inTrafficData = {
                                                    queryType: 'realtime',
                                                    ip: connectmessage[0]["switch_ip"],
                                                    locportindex: portindex
                                                };
                                            //cell9.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                                            cell9.onclick = function (event) {
                                                event = event || window.event;
                                                var ele = event.target;
                                                if ($(ele).attr('class') == 'traficinputDetail') {
                                                    inTrafficData.direction = 'input';
                                                    (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                                    inTrafficData.direction = 'output';
                                                    (new lenovoTrafficsAction()).openDetail(inTrafficData);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        for (var p = 0; p < origin_switch_link_list.length; p++) {
                            if (connectmessage[0]["switch_ip"] == origin_switch_link_list[p]["switch_ip"]) {
                                for (var q = 0; q < origin_switch_link_list[p]["link_details"].length; q++) {
                                    if (origin_switch_link_list[p]["link_details"][q]["remchassisid"] == connectmessage[0]["racklist"]["serverlist"][i]["chassisid"] && origin_switch_link_list[p]["link_details"][q]["remportiddesc"] == connectmessage[0]["tuplelist"]["eth_name"]) {
                                        if ($(e.target).attr('stroke-dasharray') == "8,6,2,6" && parseInt(origin_switch_link_list[p]["link_details"][q]["status"]) == 3 || $(e.target).attr('stroke-dasharray') !== "8,6,2,6" && parseInt(origin_switch_link_list[p]["link_details"][q]["status"]) == 1) {
                                            //( hover = dotted_line && origin_switch_status = 3) or (hover=solid_line && origin_switch_status = 1 )
                                            cell6.innerHTML = origin_switch_link_list[p]["link_details"][q]["locportid"] + "&nbsp&nbsp&nbsp&nbsp&nbsp";
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (!cell6.innerHTML) {
                            bl.deleteRow(bl.rows.length - 1);
                        }
                    }
                    //},
                    //linetime);
                })
            }

            function line_h(cxt, x1, y1, x2, y2, connectmessage) {
                if (connectmessage[0]['link_details']['status'] == "1") {
                    var path = cxt.path(["M", x1, y1, "L", x1, y2, "L", x2, y2, "L", x2, y1]).attr({
                        "stroke": connectmessage[0]["link_details"]["color"],
                        "stroke-width": 2
                    });
                }

                if (connectmessage[0]['link_details']['status'] == '3') {
                    var path = cxt.path(["M", x1, y1, "L", x1, y2, "L", x2, y2, "L", x2, y1]).attr({
                        "stroke": connectmessage[0]["link_details"]["color"],
                        "stroke-width": 2,
                        "stroke-dasharray": "--"
                    });
                }
                path.hover(function (event) {

                    //timer = setTimeout(function() {
                    var e = document.all ? window.event : arguments[0] ? arguments[0] : event;

                    document.getElementById("bl_1").style.display = "block";
                    document.getElementById("table").style.display = "none";
                    document.getElementById("foot").style.display = "none";
                    var div = document.getElementById("bl_1");
                    var movey = (y2 + y2) / 2;
                    var movex = (x1 + x2) / 2;

                    div.style.top = e.layerY + 8 + "px" ;
                    div.style.left = e.layerX + 8 - 100 + "px" ;

                    var bl = document.getElementById("tb")
                        var x = bl.createCaption();
                    for (var i = bl.rows.length - 1; i >= 0; i--) {
                        bl.deleteRow(i);

                    }
                    var row = bl.insertRow(bl.rows.length);
                    var row1 = bl.insertRow(bl.rows.length);
                    var row2 = bl.insertRow(bl.rows.length);
                    var row3 = bl.insertRow(bl.rows.length);
                    var row4 = bl.insertRow(bl.rows.length);
                    var cell1 = row.insertCell(row.cells.length);
                    var cell2 = row.insertCell(row.cells.length);
                    var cell3 = row1.insertCell(row1.cells.length);
                    var cell4 = row1.insertCell(row1.cells.length);
                    var cell5 = row2.insertCell(row2.cells.length);
                    var cell6 = row2.insertCell(row2.cells.length);
                    var cell7 = row3.insertCell(row3.cells.length);
                    var cell8 = row3.insertCell(row3.cells.length);
                    var cell9 = row4.insertCell(row4.cells.length);
                    var cell10 = row4.insertCell(row4.cells.length);
                    x.innerHTML = gettext("link details");
                    cell1.innerHTML = gettext("src_switch:");
                    cell2.innerHTML = connectmessage[0]["src_switch"];
                    cell3.innerHTML = gettext("src_port:");
                    cell4.innerHTML = connectmessage[0]["src_port"];
                    cell5.innerHTML = gettext("dst_switch:");
                    cell6.innerHTML = connectmessage[0]["dst_switch"];
                    cell7.innerHTML = gettext("dst_port:");
                    cell8.innerHTML = connectmessage[0]["dst_port"];
                    //cell9.innerHTML = gettext("traffic details:");
                    if (connectmessage[0]["link_details"]["color"] == "#5E5E5E") {
                        //cell10.innerHTML = gettext("no details");
                    } else {
                        /*                          var inputlink = "/horizon/admin/traffic/" + connectmessage[0]["link_details"]["id"] + "|input|" + connectmessage[0]["link_details"]["locportindex"] + "/detail/";
                                                    var outputlink = "/horizon/admin/traffic/" + connectmessage[0]["link_details"]["id"] + "|output|" + connectmessage[0]["link_details"]["locportindex"] + "/detail/";
                                                    cell10.innerHTML = '<a style="text-decoration:underline" href=' + inputlink + '>' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" href=' + outputlink + '>' + gettext("output") + '</a>';*/
                        var inTrafficData = {
                            queryType: 'realtime',
                            ip: connectmessage[0]['link_details']["id"],
                            locportindex: connectmessage[0]["link_details"]["locportindex"]
                        };
                        cell9.innerHTML = ' <a class="traficinputDetail" style="text-decoration:underline" href="javascript:void(0);">' + gettext("input") + '</a>' + "&nbsp&nbsp" + ' <a style="text-decoration:underline" class="traficoutputDetail" href="javascript:void(0);">' + gettext("output") + '</a>' + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                        cell9.onclick = function (event) {
                            event = event || window.event;
                            var ele = event.target;
                            if ($(ele).attr('class') == 'traficinputDetail') {
                                inTrafficData.direction = 'input';
                                (new lenovoTrafficsAction()).openDetail(inTrafficData);
                            } else if ($(ele).attr('class') == 'traficoutputDetail') {
                                inTrafficData.direction = 'output';
                                (new lenovoTrafficsAction()).openDetail(inTrafficData);
                            }
                        }
                    }
                    //},
                    //linetime);
                })
            }

            function drawOsSwitch(scene) {
                var leftDistance = /*document.getElementById("topologyCanvas").offsetWidth -*/ document.getElementById('canvas_proton_topo').width;

                var number = racklist.length;
                var number1 = floorlist2.length;
                var longMax = number1 * 72 + (number1 - 1) * 100;
                var widthMax = 0;
                for (var i = 0; i < number; i++) {
                    var singleNumber = racklist[i]["serverlist"].length;
                    if (singleNumber % 12 == 0) {
                        widthMax = widthMax + 100 * (parseInt(singleNumber / 10));
                        racklist[i]["width"] = 50 * (parseInt(singleNumber / 10));
                    } else {
                        widthMax = widthMax + 100 * (parseInt(singleNumber / 10) + 1);
                        racklist[i]["width"] = 50 * (parseInt(singleNumber / 10) + 1);
                    }
                }

                widthMax = widthMax + 100 * (number - 1);

                if (leftDistance > 0) {
                    var orign = (document.getElementById("canvas_proton_topo").width - longMax) / 2;
                } else {
                    if (longMax > widthMax) {
                        var orign = 10;
                    } else {
                        var orign = 0 + (widthMax - longMax) / 2;
                    }
                }
                var mark1 = 0;
                var mark2 = 0;
                var lined = [];
                var from_node;
                for (var i = floorlist2.length - 1; i >= 0; i--) {

                    switch_num2--;
                    floorlist2[i]["x"] = orign + 72 * i + 100 * i;
                    floorlist2[i]["y"] = 100 + 30 * 2 + 30;

                    from_node = create_container_sw(scene, floorlist2[i]["switch_details"],floorlist2[i]["x"],floorlist2[i]["y"], 72, 72, switch_num1, switch_num2, floor1);
                    floorlist2[i]["node"] = from_node;

                }
                if (floorlist2.length > 0) {
                    var minx = floorlist2[0]["x"];
                    var maxx = floorlist2[floorlist2.length - 1]["x"];
                    var length1 = floorlist1.length;
                    var length2 = floorlist2.length;
                    var maxlength1 = 72 * length1 + 100 * (length1 - 1);
                    var maxlength2 = 72 * length2 + 100 * (length2 - 1);
                    var firstlocationx = minx + maxlength2 / 2 - maxlength1 / 2;
                    var firstlocationy = 40;
                } else {
                    var firstlocationx = 200;
                    var firstlocationy = 40;
                }
                if (floorlist1.length != 0) {
                    switch_num1++;
                    from_node = create_container_sw(scene, floorlist1[0]["switch_details"],firstlocationx, firstlocationy, 72, 72, switch_num1, switch_num2, floor1);
                    floorlist1[0]["node"] = from_node;
                    floorlist1[0]["x"] = firstlocationx;
                    floorlist1[0]["y"] = firstlocationy;
                }
                for (var j = 1; j < floorlist1.length; j++) {
                    switch_num1++;
                    floorlist1[j]["x"] = firstlocationx + j * 72 + 100 * j;
                    floorlist1[j]["y"] = firstlocationy;

                    from_node = create_container_sw(scene, floorlist1[j]["switch_details"],floorlist1[j]["x"],floorlist1[j]["y"], 72, 72, switch_num1, switch_num2, floor1);
                    floorlist1[j]["node"] = from_node;
                }



                for (var m = 0; m < floorlist2.length; m++) {
                    var src1 = [];
                    var dst1 = [];
                    for (var n = 0; n < origin_switch_link_list.length; n++) {
                        if (floorlist2[m]["switch_details"]["ip"] == origin_switch_link_list[n]["switch_ip"]) {
                            for (var p = 0; p < origin_switch_link_list[n]["link_details"].length; p++) {
                                var id = 0;
                                for (var a = 0; a < lined.length; a++) {
                                    if (origin_switch_link_list[n]["link_details"][p]["remsysname"] == lined[a]) {
                                        id = 1;
                                    }
                                }
                                if (id == 0) {
                                    if (floorlist2[m]["switch_details"]["status"] !== "3" || ( floorlist2[m]["switch_details"]["status"] == "3" && floorlist2[m-1]["switch_details"]["status"] == "3" ) ) {
                                        for (var b = 0; b < floorlist2.length; b++) {

                                            if (origin_switch_link_list[n]["link_details"][p]["remsysname"] == floorlist2[b]["switch_details"]["sysname"]) {

                                                if (b != m) {

                                                    var connectmessage = [];
                                                    connectmessage.push({
                                                        "src_switch": floorlist2[m]["switch_details"]["sysname"],
                                                        "src_port": origin_switch_link_list[n]["link_details"][p]["locportid"],
                                                        "dst_switch": floorlist2[b]["switch_details"]["sysname"],
                                                        "dst_port": origin_switch_link_list[n]["link_details"][p]["remportid"],
                                                        "link_details": origin_switch_link_list[n]["link_details"][p]
                                                    });
                                                    add_switch_linkline(scene, floorlist2[m]["node"], floorlist2[b]["node"], "94,94,94", '');	
                                                    floorlist2[m]["markup"] = floorlist2[m]["markup"] + 1;
                                                    floorlist2[b]["markup"] = floorlist2[b]["markup"] + 1;
                                                    mark2 = mark2 + 1;

                                                }
                                                if (b == m) {
                                                    var vb = 0
                                                        for (var sr = 0; sr < src1.length; sr++) {
                                                            for (var ds = 0; ds < dst1.length; ds++) {
                                                                if (origin_switch_link_list[n]["link_details"][p]["locportid"] == dst1[ds] && origin_switch_link_list[n]["link_details"][p]["remportid"] == src1[sr]) {
                                                                    vb = 1;
                                                                }
                                                            }
                                                        }
                                                    var connectmessage = [];
                                                    if (vb == 0) {
                                                        connectmessage.push({
                                                            "src_switch": floorlist2[m]["switch_details"]["sysname"],
                                                            "src_port": origin_switch_link_list[n]["link_details"][p]["locportid"],
                                                            "dst_switch": floorlist2[b]["switch_details"]["sysname"],
                                                            "dst_port": origin_switch_link_list[n]["link_details"][p]["remportid"],
                                                            "link_details": origin_switch_link_list[n]["link_details"][p]
                                                        });
                                                        src1.push(origin_switch_link_list[n]["link_details"][p]["locportid"]);
                                                        dst1.push(origin_switch_link_list[n]["link_details"][p]["remportid"]);
                                                        add_switch_linkline(scene, floorlist2[m]["node"], floorlist2[m]["node"], "94,94,94", '');	
                                                        floorlist2[m]["markcircle"] = floorlist2[m]["markcircle"] + 1;

                                                        mark2 = mark2 + 1;
                                                    }
                                                }

                                            }

                                        }
                                    }
                                    for (var c = 0; c < floorlist1.length; c++) {
                                        if (origin_switch_link_list[n]["link_details"][p]["remsysname"] == floorlist1[c]["switch_details"]["sysname"]) {
                                            var connectmessage = [];

                                            connectmessage.push({
                                                "src_switch": floorlist2[m]["switch_details"]["sysname"],
                                                "src_port": origin_switch_link_list[n]["link_details"][p]["locportid"],
                                                "dst_switch": floorlist1[c]["switch_details"]["sysname"],
                                                "dst_port": origin_switch_link_list[n]["link_details"][p]["remportid"],
                                                "link_details": origin_switch_link_list[n]["link_details"][p]
                                            });
                                            add_switch_linkline(scene, floorlist2[m]["node"], floorlist1[c]["node"], "94,94,94", '');	

                                            floorlist2[m]["markh"] = floorlist2[m]["markh"] + 1;
                                            floorlist1[c]["markh"] = floorlist1[c]["markh"] + 1;

                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(floorlist2[m]["switch_details"]["status"] !== "3"){
                        lined.push(floorlist2[m]["switch_details"]["sysname"]);
                    }
                }
                for (var d = 0; d < floorlist1.length; d++) {
                    var src = [];
                    var dst = [];

                    for (var e = 0; e < origin_switch_link_list.length; e++) {
                        if (floorlist1[d]["switch_details"]["ip"] == origin_switch_link_list[e]["switch_ip"]) {
                            for (var f = 0; f < origin_switch_link_list[e]["link_details"].length; f++) {
                                var id1 = 0;
                                for (var g = 0; g < lined.length; g++) {
                                    if (origin_switch_link_list[e]["link_details"][f]["remsysname"] == lined[g]) {
                                        id1 = 1;
                                    }
                                }
                                if (id1 == 0 && floorlist1[d]["switch_details"]["status"] !== "3") {
                                    for (var h = 0; h < floorlist1.length; h++) {
                                        if (origin_switch_link_list[e]["link_details"][f]["remsysname"] == floorlist1[h]["switch_details"]["sysname"]) {
                                            if (d != h) {
                                                var connectmessage = [];
                                                connectmessage.push({
                                                    "src_switch": floorlist1[d]["switch_details"]["sysname"],
                                                    "src_port": origin_switch_link_list[e]["link_details"][f]["locportid"],
                                                    "dst_switch": floorlist1[h]["switch_details"]["sysname"],
                                                    "dst_port": origin_switch_link_list[e]["link_details"][f]["remportid"],
                                                    "link_details": origin_switch_link_list[e]["link_details"][f]
                                                });

                                                add_switch_linkline(scene, floorlist1[d]["node"], floorlist1[h]["node"], "94,94,94", '');	
                                                floorlist1[d]["markup"] = floorlist1[d]["markup"] + 1;
                                                floorlist1[h]["markup"] = floorlist1[h]["markup"] + 1;
                                                mark1 = mark1 + 1;
                                            }
                                            if (d == h) {
                                                var connectmessage = [];
                                                var hh = 0
                                                    for (var sr = 0; sr < src.length; sr++) {
                                                        for (var ds = 0; ds < dst.length; ds++) {
                                                            if (origin_switch_link_list[e]["link_details"][f]["locportid"] == dst[ds] && origin_switch_link_list[e]["link_details"][f]["remportid"] == src[sr]) {
                                                                hh = 1;
                                                            }
                                                        }
                                                    }
                                                if (hh == 0) {
                                                    connectmessage.push({
                                                        "src_switch": floorlist1[d]["switch_details"]["sysname"],
                                                        "src_port": origin_switch_link_list[e]["link_details"][f]["locportid"],
                                                        "dst_switch": floorlist1[h]["switch_details"]["sysname"],
                                                        "dst_port": origin_switch_link_list[e]["link_details"][f]["remportid"],
                                                        "link_details": origin_switch_link_list[e]["link_details"][f]
                                                    });
                                                    src.push(origin_switch_link_list[e]["link_details"][f]["locportid"]);
                                                    dst.push(origin_switch_link_list[e]["link_details"][f]["remportid"]);
                                                    add_switch_linkline(scene, floorlist1[d]["node"], floorlist1[d]["node"], "94,94,94", '');	
                                                    floorlist1[d]["markcircle"] = floorlist1[d]["markcircle"] + 1;
                                                    mark1 = mark1 + 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(floorlist1[d]["switch_details"]["status"] !== "3") {
                        lined.push(floorlist1[d]["switch_details"]["sysname"]);
                    }
                }


            }

            function drawOsRack(scene, racklist) {
                var container_rack = null;
                var leftDistance = /*document.getElementById("topologyCanvas").offsetWidth - */document.getElementById('canvas_proton_topo').width;
                var number = racklist.length;
                var number1 = floorlist2.length;
                var longMax = number1 * 72 + (number1 - 1) * 100;
                var widthMax = 0;
                for (var i = 0; i < number; i++) {
                    if(MAX_SERVER_RACK < racklist[i]["serverlist"].length)
                        MAX_SERVER_RACK = racklist[i]["serverlist"].length;
                    var singleNumber = racklist[i]["serverlist"].length;
                    if (singleNumber % 10 == 0) {
                        widthMax = widthMax + 100 * (parseInt(singleNumber / 10));
                        racklist[i]["width"] = 100 * (parseInt(singleNumber / 10));
                    } else {
                        widthMax = widthMax + 100 * (parseInt(singleNumber / 10) + 1);
                        racklist[i]["width"] = 100 * (parseInt(singleNumber / 10) + 1);
                    }
                }

                if (MAX_SERVER_RACK < DEFAULT_SERVER_RACK)
                    MAX_SERVER_RACK = DEFAULT_SERVER_RACK;

                widthMax = widthMax + 100 * (number - 1);
                var firstLocationX = 0;
                if (leftDistance > 0) {
                    firstLocationX = (document.getElementById("canvas_proton_topo").width - widthMax) / 2;
                } else {
                    if (longMax > widthMax) {
                        firstLocationX = 0 + (longMax - widthMax) / 2;
                    } else {
                        firstLocationX = 10;
                    }
                }


                //var firstLocationY = 130 + floorlist2[0]["y"] + 30;
                var firstLocationY = 130 + floorlist2[0]["y"] + 70;
                racklist[0]["x"] = firstLocationX;
                racklist[0]["y"] = firstLocationY;

                container_rack = create_rack(scene, racklist[0]["serverlist"].length, firstLocationX, firstLocationY, racklist[0]["serverlist"], racklist[0]["tuplelist"]);
                racklist[0]["node"] = container_rack;
                var lineNumber1 = racklist[0]["tuplelist"].length;

                for (var mn = 0; mn < racklist[0]['serverlist'].length; mn++) {
                    if (racklist[0]['serverlist'][mn]['status'] == 3 || racklist[0]['serverlist'][mn]['status'] == "3") {
                        racklist[0]['status'] = '3';
                    }
                }
                var widthRack = 96;
                var len = racklist[0].serverlist.length;
                widthRack = widthRack * Math.ceil(len / 10);
                var lens = racklist[0].tuplelist.length - 1;
                lens = ( lens===0 ? 1 : lens );
                var d = widthRack / lens;
                for (var mn = 0; mn < racklist[0]['serverlist'].length; mn++) {
                    if (racklist[0]['serverlist'][mn]['status'] == 3 || racklist[0]['serverlist'][mn]['status'] == "3") {
                        racklist[0]['status'] = '3';
                    }
                };
                for (var p = 0; p < lineNumber1; p++) {
                    for (var q = 0; q < floorlist2.length; q++) {
                        if (racklist[0]["tuplelist"][p]["remchassisid"] == floorlist2[q]["switch_details"]["chassisid"] && racklist[0]["tuplelist"][p]["remsysname"] == floorlist2[q]["switch_details"]["sysname"]) {
                            var connectmessage = [];

                            for (var bd = 0; bd < switch_list.length; bd++) {
                                if (switch_list[bd]["sysname"] == racklist[0]["tuplelist"][p]["remsysname"]) {
                                    connectmessage.push({
                                        "sysname": racklist[0]["tuplelist"][p]["remsysname"],
                                        "tuplelist": racklist[0]["tuplelist"][p],
                                        "racklist": racklist[0],
                                        'status': racklist[0]['status'],
                                        "switch_ip": switch_list[bd]["ip"]
                                    });
                                }
                            }

                            racklist[0]["mark"] = racklist[0]["mark"] + 1;
                            floorlist2[q]["mark"]++;
                            add_switch_linkline(scene, floorlist2[q]["node"], racklist[0]["node"],  "94,94,94", '');	

                        }

                    }
                    for (var q = 0; q < floorlist1.length; q++) {

                        if (racklist[0]["tuplelist"][p]["remchassisid"] == floorlist1[q]["switch_details"]["chassisid"] && racklist[0]["tuplelist"][p]["remsysname"] == floorlist1[q]["switch_details"]["sysname"]) {
                            var connectmessage = [];
                            for (var bd = 0; bd < switch_list.length; bd++) {
                                if (switch_list[bd]["sysname"] == racklist[0]["tuplelist"][p]["remsysname"]) {
                                    connectmessage.push({
                                        "sysname": racklist[0]["tuplelist"][p]["remsysname"],
                                        "tuplelist": racklist[0]["tuplelist"][p],
                                        "racklist": racklist[0],
                                        'status': racklist[0]['status'],
                                        "switch_ip": switch_list[bd]["ip"]
                                    });
                                }
                            }
                            racklist[0]["mark"] = racklist[0]["mark"] + 1;
                            floorlist1[q]["mark"]++;
                            add_switch_linkline(scene, floorlist1[q]["node"], racklist[0]["node"], "94,94,94", '');	
                        }
                    }
                }


                var mark = 100 + (longMax - widthMax) / 2;
                var port_distance = 0;
                for (var j = 1; j < number; j++) {
                    var widthRack = 96;
                    var lens;
                    var len = racklist[j].serverlist.length;
                    widthRack = widthRack * Math.ceil(len / 10);
                    lens = racklist[j].tuplelist.length - 1;
                    lens = ( lens===0 ? 1 : lens );
                    port_distance = widthRack / lens;
                    container_rack = create_rack(scene, racklist[j]["serverlist"].length, 100 + racklist[j - 1]["width"] + racklist[j - 1]["x"], firstLocationY, racklist[j]["serverlist"], racklist[j]["tuplelist"]);
                    racklist[j]["node"] = container_rack;

                    racklist[j]["x"] = 100 + racklist[j - 1]["width"] + racklist[j - 1]["x"];
                    racklist[j]["y"] = firstLocationY;

                    mark = mark + racklist[j - 1]["width"] + 100;
                    var lineNumber = racklist[j]["tuplelist"].length;
                    for (var mn = 0; mn < racklist[j]['serverlist'].length; mn++) {
                        if (racklist[j]['serverlist'][mn]['status'] == 3 || racklist[j]['serverlist'][mn]['status'] == "3") {
                            racklist[j]['status'] = '3';
                        }
                    }
                    for (var m = 0; m < lineNumber; m++) {
                        for (var n = 0; n < floorlist2.length; n++) {
                            if (racklist[j]["tuplelist"][m]["remchassisid"] == floorlist2[n]["switch_details"]["chassisid"] && racklist[j]["tuplelist"][m]["remsysname"] == floorlist2[n]["switch_details"]["sysname"]) {
                                var connectmessage = [];
                                for (var bd = 0; bd < switch_list.length; bd++) {
                                    if (switch_list[bd]["sysname"] == racklist[j]["tuplelist"][m]["remsysname"]) {

                                        connectmessage.push({
                                            "sysname": racklist[j]["tuplelist"][m]["remsysname"],
                                            "tuplelist": racklist[j]["tuplelist"][m],
                                            "racklist": racklist[j],
                                            'status': racklist[j]['status'],
                                            "switch_ip": switch_list[bd]["ip"]
                                        });

                                    }
                                }
                                racklist[j]["mark"] = racklist[j]["mark"] + 1;
                                floorlist2[n]["markdown"] = floorlist2[n]["markdown"] + 1;
                                add_switch_linkline(scene, floorlist2[n]["node"], racklist[j]["node"], "94,94,94", '');	
                            }
                        }
                        for (var a = 0; a < floorlist1.length; a++) {

                            if (racklist[j]["tuplelist"][m]["remchassisid"] == floorlist1[a]["switch_details"]["chassisid"] && racklist[j]["tuplelist"][m]["remsysname"] == floorlist1[a]["switch_details"]["sysname"]) {
                                var connectmessage = [];
                                for (var bd = 0; bd < switch_list.length; bd++) {
                                    if (switch_list[bd]["sysname"] == racklist[j]["tuplelist"][m]["remsysname"]) {

                                        connectmessage.push({
                                            "sysname": racklist[j]["tuplelist"][m]["remsysname"],
                                            "tuplelist": racklist[j]["tuplelist"][m],
                                            "racklist": racklist[j],
                                            'status': racklist[j]['status'],
                                            "switch_ip": switch_list[bd]["ip"]
                                        });
                                    }
                                }

                                connectmessage.push({
                                    "sysname": racklist[j]["tuplelist"][m]["remsysname"],
                                    "racklist": racklist[j]
                                });
                                racklist[j]["mark"] = racklist[j]["mark"] + 1;
                                floorlist1[a]["markdown"] = floorlist1[a]["markdown"] + 1;
                                add_switch_linkline(scene, floorlist1[a]["node"], racklist[j]["node"], "94,94,94", '');	
                            }
                        }
                    }
                }

                var stringlist = [];
                for (var ccd = 0; ccd < racklist.length; ccd++) {
                    racklist[ccd]["mark"] = 0;
                }
                for (var aa = 0; aa < origin_switch_link_list.length; aa++) {
                    for (var bb = 0; bb < origin_switch_link_list[aa]['link_details'].length; bb++) {
                        if (origin_switch_link_list[aa]['link_details'][bb]['status'] == '3' || origin_switch_link_list[aa]['link_details'][bb]['status'] == 3) {
                            for (var cc = 0; cc < racklist.length; cc++) {
                                var widthRack = 96;
                                var lens;
                                var len = racklist[cc].serverlist.length;
                                widthRack = widthRack * Math.ceil(len / 10);
                                lens = racklist[cc].tuplelist.length - 1;
                                lens = ( lens===0 ? 1 : lens );
                                port_distance = widthRack / lens;
                                //racklist[cc]["mark"]=0;
                                for (var dd = 0; dd < racklist[cc]['serverlist'].length; dd++) {
                                    if (racklist[cc]['status'] == "1" || racklist[cc]['status'] == 1) {
                                        var sting = origin_switch_link_list[aa]['link_details'][bb]['locchassisid'] + origin_switch_link_list[aa]['link_details'][bb]['remportiddesc'] + cc;
                                        if (origin_switch_link_list[aa]['link_details'][bb]['remchassisid'] == racklist[cc]['serverlist'][dd]['chassisid'] && origin_switch_link_list[aa]['link_details'][bb]['remsysname'] == racklist[cc]['serverlist'][dd]['sysname']) {
                                            var id = 0;
                                            for (var mn = 0; mn < stringlist.length; mn++) {
                                                if (sting == stringlist[mn]) {
                                                    id = 1;
                                                }
                                            }
                                            if (id == 0) {
                                                stringlist.push(sting);
                                                for (var ff = 0; ff < floorlist2.length; ff++) {
                                                    if (origin_switch_link_list[aa]['link_details'][bb]['locchassisid'] == floorlist2[ff]["switch_details"]["chassisid"] && origin_switch_link_list[aa]['link_details'][bb]['locsysname'] == floorlist2[ff]["switch_details"]["sysname"]) {
                                                        var connectmessage = [];
                                                        var tuplelist = {
                                                            "remsysname": floorlist2[ff]["switch_details"]['sysname'],
                                                            'remchassisid': floorlist2[ff]["switch_details"]['chassisid'],
                                                            'eth_name': origin_switch_link_list[aa]['link_details'][bb]['remportiddesc']
                                                        };

                                                        connectmessage.push({
                                                            "sysname": floorlist2[ff]["switch_details"]["sysname"],
                                                            'tuplelist': tuplelist,
                                                            "racklist": racklist[cc],
                                                            'status': '3',
                                                            "switch_ip": floorlist2[ff]["switch_details"]['ip']
                                                        });

                                                        racklist[cc]["mark"] = racklist[cc]["mark"] + 1;
                                                        floorlist2[ff]["markdown"] = floorlist2[ff]["markdown"] + 1;
                                                        ////line_rack(cxt, racklist[j]["x"] + 2 + (racklist[j]["mark"] - 1) * port_distance, firstLocationY, floorlist2[n]["x"] + 36, floorlist2[n]["y"] + 78, connectmessage);
                                                        var x1 = racklist[cc]["x"] + 2 + port_distance / 2 + (racklist[cc]["mark"] - 1) * port_distance;
                                                        if (racklist[cc]["mark"] == lens) {
                                                            x1 = racklist[cc]["x"] + 2 + port_distance / 2 + (racklist[cc]["mark"] - 1) * port_distance - 3 * port_distance / 4;
                                                        }
                                                        //line_rack(cxt, x1, firstLocationY, floorlist2[ff]["x"] + 36, floorlist2[ff]["y"] + 78, connectmessage, 'dotted');
                                                    }

                                                }
                                                for (var ff = 0; ff < floorlist1.length; ff++) {
                                                    if (origin_switch_link_list[aa]['link_details'][bb]['locchassisid'] == floorlist1[ff]["switch_details"]["chassisid"] && origin_switch_link_list[aa]['link_details'][bb]['locsysname'] == floorlist1[ff]["switch_details"]["sysname"]) {
                                                        var connectmessage = [];
                                                        var tuplelist = {
                                                            "remsysname": floorlist1[ff]["switch_details"]['sysname'],
                                                            'remchassisid': floorlist1[ff]["switch_details"]['chassisid'],
                                                            'eth_name': origin_switch_link_list[aa]['link_details'][bb]['remportiddesc']
                                                        };

                                                        connectmessage.push({
                                                            "sysname": floorlist1[ff]["switch_details"]["sysname"],
                                                            'tuplelist': tuplelist,
                                                            "racklist": racklist[cc],
                                                            'status': '3',
                                                            "switch_ip": floorlist1[ff]["switch_details"]['ip']
                                                        });

                                                        racklist[cc]["mark"] = racklist[cc]["mark"] + 1;
                                                        floorlist1[ff]["markdown"] = floorlist1[ff]["markdown"] + 1;
                                                        var x1 = racklist[cc]["x"] + 2 + port_distance / 2 + (racklist[cc]["mark"] - 1) * port_distance;
                                                        if (racklist[cc]["mark"] == lens) {
                                                            x1 = racklist[cc]["x"] + 2 + port_distance / 2 + (racklist[cc]["mark"] - 1) * port_distance - 3 * port_distance / 4;
                                                        }
                                                        add_switch_linkline(scene, floorlist2[0]["node"], floorlist2[n]["node"], "94,94,94", '');	
                                                    }

                                                }

                                            }
                                        }


                                    }

                                }
                            }

                        }


                    }

                }
            }

            drawOsSwitch(scene);
            drawOsRack(scene, racklist1);
        }



        }
    }
}());
