package com.tensquare.qa.pojo;

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
@Table(name="tb_problem")
public class Problem implements Serializable{

	@Id
	private String id;//ID
	private String title;//标题
	private String content;//内容
	private java.util.Date createtime;//创建日期
	private java.util.Date updatetime;//修改日期
	private String userid;//用户ID
	private String nickname;//昵称
	private Long visits;//浏览量
	private Long thumbup;//点赞数
	private Long reply;//回复数
	private String solve;//是否解决
	private String replyname;//回复人昵称
	private java.util.Date replytime;//回复日期
}
