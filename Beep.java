import java.applet.Applet;
import java.awt.*;
import java.awt.event.*;

public class Beep extends Applet {

  public void init() {
  }

  public void beep() {
    this.getToolkit().beep();
  }
}