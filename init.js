
// Globals
  
// Canvas context 2D
var c = a.getContext("2d");

// Init local storage to 1 if it's not already set
localStorage["scpm"] = 20;

// Current screen (0: main menu / 1: level selection / 2: playing / 3: editor)
var screen = 0;

// Previous screen (when we quit a level, 0: when playing a shared level / 1: when playing a built-in level / 3: whe testing a level in the level eitor)
var last_screen = 0;

// Mouse down (player is clicking)
var mousedown = false;

// Player is right clicking
var rightclick = false;

// Hero's width (not 32px in order to pass easily between two blocks)
var hero_width = 24;

// Gravity (downwards acceleration):
var gravity = 2;

// Max fall speed (for hero and cubes)
var max_fall_speed = 24;

// Jump speed (upwards vy force):
var jump_speed = 20;

// Walk speed (horizontal vx)
var walk_speed = 6;

// Mouse coords (in tiles)
var tile_x = tile_y = 0;

// Mouse coords (in px)
var x = y = 0;

// Current level
var level = 0;

// All the data of the current level
var level_data = {};

// Loop vars
var i,j,k,l,m;

// Other globals (editor)
var pipe_click, current_pipe, balance_click, current_balance, current_editor_tile, mouse_tile_x, mouse_tile_y, pipe_high, pipe_low, end_pipe, end_pole, number, drawn_tile, shared, chose_a_tile;

// Other globals (gameplay)
var win, win_frame, lose_frame, paradox_frame, coins_left, loop, frame, current_hero, solid, yellow_toggle, yellow_toggle_last_frame, pipes_state, balances_state, yellow_toggle_delay, yellow_toggle_on, blue_portal, orange_portal, temp_side, heros, hero, target, current_cube, portals, current_portal;

// Built-in levels:
var levels = [
  
{},
  
// 1
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000200\
0000060606000000000000000060000000000000\
0000000000000000400400000000000000000000\
0F00000000000004400440000000000000000000\
0G00000000000044400444000070000700000400\
3333333333333333300333333333333333333333\
3333333333333333300333333333333333333333\
0000000000000000000000000000000000000000","pipes":[[]],"balances":[]},

// 2
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000060060060000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000060060000000000000000000020\
0000000050050050050000400040000000000000\
0F00000000000000000004400044000000000000\
0G00000000000000000044400044400077000000\
3333333333333333333333333333333333333333\
3333333333333333333333333333333333333333\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 3
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000060000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000040040040080080000020\
0000060060060000400000000000000000000000\
0F00000000000004440000000000000000000000\
0G00000000000044444000000000000000000000\
3338888888888888888888888888888888888333\
3338888888888888888888888888888888888333\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 4
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000600000000000000000000000000000\
0000000000000000000000000000000000000020\
0000000000600000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000600000<00000000000000000000000\
0000000000000000000000004000000004000000\
0000<00<00400000000000044000000004400000\
0F00000000440000000000444000000004440000\
0G00000000444000000004444000000004444000\
3333333333333333033333333333333333333333\
3333333333333333333333333333333333333333\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 5
{"hash":"0000000000000000000000000000000000000000\
00000000<0000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000999900000000000000000000000000000\
0000000000900000000000000000000000000000\
0000000:::900000000000000000000000000000\
0000000000900000000000000000000000000000\
0000000999900000000000000000000000000000\
0000000000900000000000000000000000000000\
0000000:::900000000000000000000000000000\
0000000000900000000000000000000000000000\
0000000666900000000000000000000000000002\
0000000000900000<00000000000000000000000\
0000000999900000500000000000000000000004\
0000000000900000000000000000000000000004\
0F00000000900000000000000000000000000004\
0G0;000000900;000000;00000000000;0000004\
33333333333333333999999933333::::::33333\
33333333333333333999999933333::::::33333\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 6
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000033333333333000\
0000000044000000000000000000000000000000\
0000000000000000000060000000000000000000\
000000000000600000000000000<000000200000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000300000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0F00000000000000000000000000000000000000\
0G00000000000000000000000000000000000000\
3333333333333333333333333333333333333333\
3333333333333333333333333333333333333333\
0000000000000000000000000000000000000000","pipes":[[8,8,16,6,16],[24,16,6,22,16],[35,7,16,30,5]],"balances":[]},

// 7
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000<00000000000\
0000000000000000000000000000000000000000\
0000000000000000000009999999990000000000\
0000000000000000000000000000000000000020\
0000000000000000000000000000000000000000\
00F0000000000000000000000000000000000000\
00G0000000000000000000000000000000000000\
3333330000000000000000000000000000000000\
3333330000000000000000000000000000000000\
0000000000000000000000000000000000000040\
000000000000000000;000060000000000000040\
0000000000000000333330060000000000000040\
0000000000000000333330060000000033333333\
0000000000000000000000000000000033333333\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[[8,9,13,17],[28,6,23,14]]},

// 8
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0444444444444400000000000000000000000000\
0300000000000000000000000000000000000040\
0306060606000000000000000000000000006040\
03000000000<0000000000000000000000000040\
0300000000000000000000000000000000000040\
0300000444444400000000000000000000000040\
0300000300000000000000000000000000000040\
0300000300000000000000000000000000000040\
0300000300000000000000000000000000000040\
0300000300000000000000000000000000000040\
0300000300000000000000000020000000000040\
0300000300000000000000000000000000000040\
0400F00400000000000000000000000000000040\
0400G0040000000000000000000000000000;040\
044444440000000000000000003::::::::33330\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 9
{"hash":"0000000000000000000000000000000000000000\
0444400000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000006000000000000000000000000000\
0400000000000000000000000000000000000000\
0400000000000000000000000000000000000200\
0400000000000000000000000000000000000000\
040000F000000000000000000000000000000000\
040000G000000000000000000000000000000000\
0444444444444000000000000888888888888880\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 10
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000008888888888888888888800000000000\
0000000003000000000000000000800000000000\
0000000003000000000000000000800000000000\
0000000003002000000000000000800000000000\
0000000003000000000000000000800000000000\
0000000003000000000006000000800000000000\
0000000003000000000000000000800000000000\
0000000004444444444444060000800000000000\
0000000003000000000000000000800000000000\
0000000003000000000006000000800000000000\
0000000003000000000000000000800000000000\
0000000003000000000000000000800000000000\
000000000300F000000000000000800000000000\
000000000300G000000000000000800000000000\
0000000004444444444444000000800000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[],"balances":[]},

// 11
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000002030000000\
0000000000000000000000000000000030000000\
0000000000000000000000000000000030000000\
0000000000000000000000033333333330000000\
0000000000000000000000030000000000000000\
0000000000000000000000030000000000000000\
0000000000000000000000030000000000000000\
0000000000000000000000030000000000000000\
0000000000000000000000030000000000000000\
0000000030600000000000030000000000000000\
0000000030000000F00000030000000000000000\
0000000030000000G00000030000000000000000\
0000000033333333333333330000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[21,16,8,10,16]],"balances":[]},

// 12
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000020000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000006660000000\
0000000000000000000000000000000000000000\
0000000000000000000060000000000000000000\
0000000000000000000000000333009990000000\
000000000000000000600::00000000000000000\
00000000000000000000:::00000000000000000\
0000000000000000600::::00000000000000000\
000000000000000000:::::00000000000000000\
00000000000000600::::::00000000000000000\
0000000000000000:::::::00000000000000000\
000000000000600::::::::00000000000000000\
00000000000000:::::::::00000000000000000\
00000F0000600::::::::::00000000000000000\
00000G00;000:::::::::::00000000000000000\
3333333333333333333333333333333333333333\
3333333333333333333333333333333333333333\
0000000000000000000000000000000000000030","pipes":[],"balances":[]},

// 13
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000003000000000000000000003000000000\
0000000003000000606060606060603000000000\
0000000003000000000000000000003000000000\
000000000300000:::::::::::::::3000000000\
0000000003000000000000000000003000000000\
0000000003000000000000000000003000000000\
0000000003000000000000000000003000000000\
0000000003000000000000000000203000000000\
0000000003000000000000000000003000000000\
0000000003000000000000000000003000000000\
0000000003000000000000000000003000000000\
00000000030000000000000000F0003000000000\
000000000300000000;0000000G0003000000000\
0000000003333333333333333333333000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[11,15,6,21,15]],"balances":[]},

// 14
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000006000000\
0000000000000000000000000000000006000000\
0000000000000000000000000000000006000000\
000000000000000000000000000;;;;;;;000000\
0000000000000000000000000003333333000000\
0000002000000000000000000003000000000000\
0000000000000000000000000003000000000000\
0000030000000000000000000003000000000000\
00000300F0000000000000000003000000000000\
00000300G0000000000000000003000000000000\
0000033333399999999999933333000000000000\
0000000000300000000000030000000000000000\
0000000000300000000000030000000000000000\
0000000000300000000000030000000000000000\
0000000000333333333333330000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000","pipes":[[25,12,7,17,12]],"balances":[]},

// 15
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000000000200000000000\
0000000000000000000000000000000000000000\
0000000000000004444444444000000000000000\
0000000000006000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000000006000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000000006000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000000000000000000004000000000000000\
0000000F00000000000000004000000000000000\
0000000G00000003000000004000000000000000\
3333333333333333333333333333333333333333\
3333333333333333333333333333333333333333\
0000000000300000000000000003000300000000","pipes":[],"balances":[[22,7,12,14]]},

// 16
{"hash":"0000000000000000000000000000000000000000\
0000000000000000000000000000000000000000\
0000000000000000000000009000000000000000\
0000000000000000020F00099000000000000000\
0000000000000000000G00999000:00000000000\
0000000000000055555555555000000000000000\
000000000000000000454000000000:000000000\
0000000000000000004540000000000000000000\
0000000000000000004540000000:00000000000\
0000000000000000004540000000000000000000\
000000000000000000454000000000:000000000\
0000000000000000004540000000000000000000\
0000000000000000004540000000:00000000000\
0000000000000000004540000000000000000000\
000000000000000000454000000000:000000000\
0000000000000006004540060000000000000000\
0000000000000000004540000000:00000000000\
0000000<000000000045400;0000000000000000\
0000005555555599955555555555555550000000\
0000000000000000000000000000000000000000","pipes":[[12,17,5,15,17]],"balances":[]}

];
