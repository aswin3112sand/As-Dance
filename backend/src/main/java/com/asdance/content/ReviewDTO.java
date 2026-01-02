package com.asdance.content;

public class ReviewDTO {
  private String id;
  private String txt;
  private String tagline;
  private int profileIndex;

  public ReviewDTO(String id, String txt, String tagline, int profileIndex) {
    this.id = id;
    this.txt = txt;
    this.tagline = tagline;
    this.profileIndex = profileIndex;
  }

  public String getId() { return id; }
  public String getTxt() { return txt; }
  public String getTagline() { return tagline; }
  public int getProfileIndex() { return profileIndex; }
}
