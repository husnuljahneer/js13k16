// Game loop
var play = () => {

  // Reset canvas
  a.width ^= 0;
  
  // Draw exit button
  c.font = "bold 30px arial";
  c.fillStyle = "#000";
  c.fillText("×", 1255, 25);
  
  // First levels: add text
  if(last_screen == 1){
    if(level == 1){
      c.font = "bold 30px arial";
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText("Move with arrow keys or WASD or ZQSD.", 640, 80);
      c.fillText("Pick and drop cubes with [space]. Restart with R.", 640, 120);
      c.fillText("Collect all coins and reach the flag.", 640, 160);
    }
    if(level == 2){
      c.font = "bold 30px arial";
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText("Mechanisms...", 640, 80);
    }
  }
  
  // Pixelize graphics
  c.mozImageSmoothingEnabled = false;
  c.imageSmoothingEnabled = false;
  
  // On first frame:
  // ---------------
  if(frame == 0){
    
    // Init states of pipes, cubes, balances...
    first_frame();
  }
  
  // Then, at each frame:
  // --------------------
  
  // Move and draw pipes
  move_draw_pipes();
  
  // Draw map
  parse_draw_map();
  
  // Reset all mechanisms
  reset_mechanisms();
  
  // Move mario
  // ==========
  
  // If not dead and didn't win
  if(current_mario.state != 3 && !win){
    
    // Idle
    current_mario.state = 0;
    
    // Go right
    if(current_mario.right){
      current_mario.keyright[frame] = true;
      current_mario.x += walk_speed;
      current_mario.direction = 1;
      if(current_mario.grounded){
        current_mario.state = 1;
      }
    }
    
    // Go left
    if(current_mario.left){
      current_mario.keyleft[frame] = true;
      current_mario.x -= walk_speed;
      current_mario.direction = 0;
      if(current_mario.grounded){
        current_mario.state = 1;
      } 
    }
    
    // Jump
    if(current_mario.up && current_mario.grounded && current_mario.can_jump){
      current_mario.keyup[frame] = true;
      current_mario.vy -= jump_speed;
      current_mario.grounded = false;
      current_mario.can_jump = false;
    }
    
    // Jump sprite
    if(current_mario.vy < 0 && !current_mario.grounded){
      current_mario.state = 2;
    }
    
    // Apply gravity and collsions
    gravity_and_collisions(current_mario, mario_width);
    
    // Collect coins (tile 6 => tile 0)
    if(tile_at(current_mario.x + mario_width / 2, current_mario.y + 16) == 6){
      set_tile(current_mario.x + mario_width / 2, current_mario.y + 16, 0);
    }
    
    // Die (spike)
    if(
      tile_at(current_mario.x + 3, current_mario.y) == 7
      ||
      tile_at(current_mario.x + mario_width - 3, current_mario.y) == 7
      ||
      tile_at(current_mario.x + 3, current_mario.y + 5) == 7
      ||
      tile_at(current_mario.x + mario_width - 3, current_mario.y + 5) == 7
    ){
      current_mario.state = 3;
      current_mario.vy = -1.5 * jump_speed;
    }
    
    // Die (fall)
    if(current_mario.y > 648){
      current_mario.state = 3;
      current_mario.vy = -1.5 * jump_speed;
    }
    
    // Pick cube
    if(current_mario.space){
      current_mario.keyspace[frame] = true;
      if(current_mario.cube_held === null){
        for(i in level_data.cubes){
          if(
            current_mario.x + mario_width >= level_data.cubes[i].x
            &&
            current_mario.x <= level_data.cubes[i].x + 31
            &&
            current_mario.y + 31 >= level_data.cubes[i].y
            &&
            current_mario.y <= level_data.cubes[i].y + 31
          ){
            current_mario.cube_held = i;
            level_data.cubes[i].mario = current_mario;
            current_mario.pick_cube_animation_frame = 5;
            break;
          }
        }
      }
    }
    
    // Drop cube
    else {
      if(level_data.cubes[current_mario.cube_held]){
        
        // Drop ahead of mario (todo)
        //level_data.cubes[current_mario.cube_held].x = current_mario.x + (current_mario.direction == 1 ? 1 : -1) * 16;
        //if(is_solid(tile_at( ~~((level_data.cubes[current_mario.cube_held].x + 32) / 32), level_data.cubes[current_mario.cube_held].y))){
        //  level_data.cubes[current_mario.cube_held].x = current_mario.x;
        //}        
        level_data.cubes[current_mario.cube_held].mario = null;
        current_mario.cube_held = null;
        current_mario.weight = 1;
      }
    }
    
    // Hold cube
    if(current_mario.cube_held !== null){
      level_data.cubes[current_mario.cube_held].x = current_mario.x + (current_mario.direction * -1) * 8;
      
      // Animate cube grab (make it last 5 frames)
      if(current_mario.pick_cube_animation_frame){
        current_mario.pick_cube_animation_frame--;
      }
      
      // Place cube over Mario
      level_data.cubes[current_mario.cube_held].y = current_mario.y - 32 + current_mario.pick_cube_animation_frame * 4;
    }
    
    // If no cube is held, cancel space key
    else {
      current_mario.space = 0;
    }
    
    // Win (all coins gathered and touch flag)
    if(tile_at(current_mario.x + mario_width / 2, current_mario.y + 16) == 2 || tile_at(current_mario.x + mario_width / 2, current_mario.y + 16) == 24){
      coins_left = 0;
      for(j = 0; j < 20; j++){
        for(i = 0; i < 40; i++){
          if(level_data.tiles[j][i] == 6){
           coins_left++;
          }
        }
      }
      if(coins_left == 0){
        win = true;
      }
    }
  }
  
  // Death animation
  if(current_mario.state == 3){
    current_mario.vy += gravity;
    if(current_mario.vy > max_fall_speed){
      current_mario.vy = max_fall_speed;
    }
    current_mario.y += current_mario.vy;
  }
  
  // Move cubes
  // =====
  
  for(i in level_data.cubes){
    
    // Apply gravity and collsions
    //apply_gravity_and_collisions(level_data.cubes[i], 32);
    
  }
  
  // Draw cubes
  for(i in level_data.cubes){
    c.drawImage(tileset, 12 * 16, 0, 16, 16, level_data.cubes[i].x, 40 + level_data.cubes[i].y, 32, 32);
  }
  
  // Draw Mario (facing right)
  if(current_mario.direction == 1){
    c.drawImage(tileset, [26, [27,28,29][~~(frame / 2) % 3], 30, 31][current_mario.state] * 16, 0, 16, 16, current_mario.x - 4, 40 + current_mario.y, 32, 32);
  }
  
  // Draw Mario (facing left)
  else{
    c.save();
    c.translate(current_mario.x + mario_width + 4, current_mario.y);
    c.scale(-1,1);
    c.drawImage(tileset, [26, [27,28,29][~~(frame / 2) % 3], 30, 31][current_mario.state] * 16, 0, 16, 16, 0, 40, 32, 32);
    c.restore();
  }
  
  // Apply yellow toggle (invert plain and transparent tiles if yellow toggle has changed during this frame)
  if(yellow_toggle != yellow_toggle_last_frame){
    for(j = 0; j < 20; j++){
      for(i = 0; i < 40; i++){
        if(level_data.tiles[j][i] == 9){
          level_data.tiles[j][i] = 10;
        }
        else if(level_data.tiles[j][i] == 10){
          level_data.tiles[j][i] = 9;
        }
      }
    }
  }
  
  // Save yellow toggle state 
  yellow_toggle_last_frame = yellow_toggle;
  
  // Balances
  for(i in level_data.balances){
    
    // More weight on side 1
    if(balances_state[i].weight1 > balances_state[i].weight2){
      balances_state[i].y1 += 4;
      balances_state[i].y2 -= 4;
    }
    
    // More weight on side 2
    else if(balances_state[i].weight2 > balances_state[i].weight1){
      balances_state[i].y1 -= 4;
      balances_state[i].y2 += 4;
    }
    
    // Draw balance 1
    draw_sprite(15, level_data.balances[i][0] * 32 - 32, balances_state[i].y1 + 40);
    draw_sprite(15, level_data.balances[i][0] * 32, balances_state[i].y1 + 40);
    draw_sprite(15, level_data.balances[i][0] * 32 + 32, balances_state[i].y1 + 40);
    
    // Draw balance 2
    draw_sprite(15, level_data.balances[i][2] * 32 - 32, balances_state[i].y2 + 40);
    draw_sprite(15, level_data.balances[i][2] * 32, balances_state[i].y2 + 40);
    draw_sprite(15, level_data.balances[i][2] * 32 + 32, balances_state[i].y2 + 40);
  }
  
  // Next frame
  frame++;
  
  //document.title = frame + " " + current_mario.weight + " " + balances_state[0].weight1 + " " + balances_state[0].weight2 + " " + level_data.cubes[1].weight;
  
  // Win animation
  if(win){
    win_frame++;
    c.font = "bold 100px arial";
    c.fillStyle = "#000";
    c.textAlign = "center";
    c.fillText("CLEARED!", 640, 350)
  }
  if(win_frame >= 30){
    a.width ^= 0;
    clearInterval(loop);
    screen = last_screen;
    level_data.tested = true;
    a.width ^= 0;
    draw_screen();
  }
}
