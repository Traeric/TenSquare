package com.tensquare.recruit.service;

import com.tensquare.recruit.dao.LabelDao;
import com.tensquare.recruit.pojo.Label;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import utils.IdWorker;

import javax.annotation.Resource;
import javax.persistence.criteria.Predicate;
import java.util.LinkedList;
import java.util.List;

@Service
@Transactional
public class LabelService {
    @Resource
    private LabelDao labelDao;
    @Resource(name = "idWorker")
    private IdWorker idWorker;

    /**
     * 查询所有
     * @return
     */
    public List<Label> findAll() {
        return labelDao.findAll();
    }

    public Label findById(String id) {
        return labelDao.findById(id).orElse(null);
    }

    public void save(Label label) {
        // 根据雪花算法生成分布式id
        label.setId(String.valueOf(idWorker.nextId()));
        labelDao.save(label);
    }

    public void update(Label label) {
        labelDao.save(label);
    }

    public void deleteById(String id) {
        labelDao.deleteById(id);
    }

    /**
     * 封装查询对象
     * @param label
     * @return
     */
    private Specification<Label> searchMap(Label label) {
        return (Specification<Label>) (root, query, cb) -> {
            List<Predicate> list = new LinkedList<>();
            if (!StringUtils.isEmpty(label.getLabelname())) {
                Predicate labelname = cb.like(root.get("labelname").as(String.class), "%" + label.getLabelname() + "%");
                list.add(labelname);
            }
            if (!StringUtils.isEmpty(label.getState())) {
                Predicate state = cb.like(root.get("state").as(String.class), label.getState());
                list.add(state);
            }
            Predicate[] array = new Predicate[list.size()];
            array = list.toArray(array);
            return cb.and(array);
        };
    }

    /**
     * 按条件查询
     * @param label
     * @return
     */
    public List<Label> findSearch(final Label label) {
        return labelDao.findAll(searchMap(label));
    }

    /**
     * 分页查询
     * @param label
     * @param currentPage
     * @param pageSize
     * @return
     */
    public Page<Label> pageQuery(Label label, int currentPage, int pageSize) {
        return labelDao.findAll(searchMap(label), PageRequest.of(currentPage - 1, pageSize));
    }
}
