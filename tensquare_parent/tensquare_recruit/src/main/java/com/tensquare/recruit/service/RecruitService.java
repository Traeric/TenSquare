package com.tensquare.recruit.service;

import com.tensquare.recruit.dao.RecruitDao;
import com.tensquare.recruit.pojo.Recruit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import utils.IdWorker;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 服务层
 * 
 * @author Administrator
 *
 */
@Service
public class RecruitService {

	@Autowired
	private RecruitDao recruitDao;
	
	@Autowired
	private IdWorker idWorker;


	public List<Recruit> recommend() {
        return recruitDao.findTop6ByStateOrderByCreatetimeDesc("2");
    }

    public List<Recruit> newList() {
        return recruitDao.findTop6ByStateNotOrderByCreatetimeDesc("0");
    }

    public void save(Recruit recruit) {
        // 根据雪花算法生成分布式id
        recruit.setId(String.valueOf(idWorker.nextId()));
		recruitDao.save(recruit);
    }

	/**
	 * 查询全部列表
	 * @return
	 */
	public List<Recruit> findAll() {
		return recruitDao.findAll();
	}

	
	/**
	 * 条件查询+分页
	 * @param whereMap
	 * @param page
	 * @param size
	 * @return
	 */
	public Page<Recruit> findSearch(Map whereMap, int page, int size) {
		Specification<Recruit> specification = createSpecification(whereMap);
		PageRequest pageRequest =  PageRequest.of(page-1, size);
		return recruitDao.findAll(specification, pageRequest);
	}

	
	/**
	 * 条件查询
	 * @param whereMap
	 * @return
	 */
	public List<Recruit> findSearch(Map whereMap) {
		Specification<Recruit> specification = createSpecification(whereMap);
		return recruitDao.findAll(specification);
	}

	/**
	 * 根据ID查询实体
	 * @param id
	 * @return
	 */
	public Recruit findById(String id) {
		return recruitDao.findById(id).orElse(null);
	}

	/**
	 * 修改
	 * @param recruit
	 */
	public void update(Recruit recruit) {
		recruitDao.save(recruit);
	}

	/**
	 * 删除
	 * @param id
	 */
	public void deleteById(String id) {
		recruitDao.deleteById(id);
	}

	/**
	 * 动态条件构建
	 * @param searchMap
	 * @return
	 */
	private Specification<Recruit> createSpecification(Map searchMap) {

		return new Specification<Recruit>() {

			@Override
			public Predicate toPredicate(Root<Recruit> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicateList = new ArrayList<Predicate>();
                // ID
                if (searchMap.get("id")!=null && !"".equals(searchMap.get("id"))) {
                	predicateList.add(cb.like(root.get("id").as(String.class), "%"+(String)searchMap.get("id")+"%"));
                }
                // 职位名称
                if (searchMap.get("jobname")!=null && !"".equals(searchMap.get("jobname"))) {
                	predicateList.add(cb.like(root.get("jobname").as(String.class), "%"+(String)searchMap.get("jobname")+"%"));
                }
                // 薪资范围
                if (searchMap.get("salary")!=null && !"".equals(searchMap.get("salary"))) {
                	predicateList.add(cb.like(root.get("salary").as(String.class), "%"+(String)searchMap.get("salary")+"%"));
                }
                // 经验要求
                if (searchMap.get("condition")!=null && !"".equals(searchMap.get("condition"))) {
                	predicateList.add(cb.like(root.get("condition").as(String.class), "%"+(String)searchMap.get("condition")+"%"));
                }
                // 学历要求
                if (searchMap.get("education")!=null && !"".equals(searchMap.get("education"))) {
                	predicateList.add(cb.like(root.get("education").as(String.class), "%"+(String)searchMap.get("education")+"%"));
                }
                // 任职方式
                if (searchMap.get("type")!=null && !"".equals(searchMap.get("type"))) {
                	predicateList.add(cb.like(root.get("type").as(String.class), "%"+(String)searchMap.get("type")+"%"));
                }
                // 办公地址
                if (searchMap.get("address")!=null && !"".equals(searchMap.get("address"))) {
                	predicateList.add(cb.like(root.get("address").as(String.class), "%"+(String)searchMap.get("address")+"%"));
                }
                // 企业ID
                if (searchMap.get("eid")!=null && !"".equals(searchMap.get("eid"))) {
                	predicateList.add(cb.like(root.get("eid").as(String.class), "%"+(String)searchMap.get("eid")+"%"));
                }
                // 状态
                if (searchMap.get("state")!=null && !"".equals(searchMap.get("state"))) {
                	predicateList.add(cb.like(root.get("state").as(String.class), "%"+(String)searchMap.get("state")+"%"));
                }
                // 网址
                if (searchMap.get("url")!=null && !"".equals(searchMap.get("url"))) {
                	predicateList.add(cb.like(root.get("url").as(String.class), "%"+(String)searchMap.get("url")+"%"));
                }
                // 标签
                if (searchMap.get("label")!=null && !"".equals(searchMap.get("label"))) {
                	predicateList.add(cb.like(root.get("label").as(String.class), "%"+(String)searchMap.get("label")+"%"));
                }
                // 职位描述
                if (searchMap.get("content1")!=null && !"".equals(searchMap.get("content1"))) {
                	predicateList.add(cb.like(root.get("content1").as(String.class), "%"+(String)searchMap.get("content1")+"%"));
                }
                // 职位要求
                if (searchMap.get("content2")!=null && !"".equals(searchMap.get("content2"))) {
                	predicateList.add(cb.like(root.get("content2").as(String.class), "%"+(String)searchMap.get("content2")+"%"));
                }
				
				return cb.and( predicateList.toArray(new Predicate[predicateList.size()]));

			}
		};

	}

}
