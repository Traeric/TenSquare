package com.tensquare.user.pojo;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
/**
 * 实体类
 * @author Administrator
 *
 */
@Data
@Entity
@Table(name="tb_admin")
public class Admin implements Serializable{

	@Id
	private String id;//ID


	
	private String loginname;//登陆名称
	private String password;//密码
	private String state;//状态
}
