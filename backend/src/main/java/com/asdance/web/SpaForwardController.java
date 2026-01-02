package com.asdance.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

  // Forward all non-file routes to index.html for React Router support.
  @RequestMapping(value = { "/", "/{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
  public String forward() {
    return "forward:/index.html";
  }
}
