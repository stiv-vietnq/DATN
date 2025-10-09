package com.coverstar.service.Impl;

import java.util.Optional;

import com.coverstar.repository.RoleRepository;
import com.coverstar.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coverstar.entity.Role;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	private RoleRepository roleDao;
	
	@Override
	public Optional<Role> findById(Long id) {
		return roleDao.findById(id);
	}

	@Override
	public Role create(Role role) {
		return roleDao.save(role);
	}

}
